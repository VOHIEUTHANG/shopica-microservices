import { Component } from '@angular/core';
import { PurchaseOrder } from '../../models/purchase-order';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseParams } from '@app/modules/common/base-params';
import { CategoryService } from '@app/modules/category/services/category.service';
import { BrandService } from '@app/modules/brand/services/brand.service';
import { SizeService } from '@app/modules/size/services/size.service';
import { ColorService } from '@app/modules/color/services/color.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Category } from '@app/modules/category/models/category';
import { Brand } from '@app/modules/brand/models/brand';
import { Size } from '@app/modules/size/models/size';
import { Color } from '@app/modules/color/models/Color';
import { PurchaseOrderDetail } from '../../models/purchase-order-detail';
import { ProductService } from '@app/modules/product/services/product.service';
import { Product } from '@app/modules/product/model/product';
import { OrderStatus } from '@app/modules/order/model/order';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrl: './purchase-order-detail.component.css'
})
export class PurchaseOrderDetailComponent {
  isLoadingButtonSubmit: boolean;
  isLoadingCategoryInSelect = true;
  isLoadingBrandInSelect = true;
  isLoadingProductEdit = false;

  params = new BaseParams(1, 5);
  listSize: Size[];
  listColor: Color[];
  listProduct: Product[] = [];
  editId: number;

  tags: string[] = [];

  sizeIdsSelected: number[] = [];
  colorIdsSelected: number[] = [];
  purchaseorderId: number;
  i: number = 0;
  viewMode: boolean;

  purhcaseOrderDetails: PurchaseOrderDetail[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly purchaseorderService: PurchaseOrderService,
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    // this.loadSize();
    // this.loadColor();
    this.loadProduct();


    //edit mode
    this.activatedRoute.params.subscribe(params => {
      if (params.purchaseOrderId) {
        this.purchaseorderId = params.purchaseOrderId
        this.viewMode = true;
        this.loadPurchaseOrderEdit(this.purchaseorderId);
      }
    });
  }



  loadPurchaseOrderEdit(purchaseorderId: number) {
    this.purchaseorderService.getById(purchaseorderId).subscribe(res => {
      if (res.isSuccess) {
        this.purhcaseOrderDetails = res.data.purchaseOrderDetails;
      }
    })
  }

  loadColorSizeSelected(purchaseorderDetails) {
    const sizeIds = new Set<number>();
    const colorIds = new Set<number>();
    purchaseorderDetails.forEach(item => {
      sizeIds.add(item.sizeId);
      colorIds.add(item.colorId);
    });
    this.colorIdsSelected = [...colorIds];
    this.sizeIdsSelected = [...sizeIds];
  }


  loadProduct() {
    this.productService.getAll(new BaseParams(1, 50)).pipe(
    ).subscribe(response => {
      if (response.isSuccess) {
        this.listProduct = response.data.data;
      }
    });
  }


  submitForm() {
    // const purchaseorderColors: PurchaseOrderColor[] = (this.purchaseorderForm.controls["colorIds"].value as number[]).map(x => ({ colorId: x }))
    // const purchaseorderSizes: PurchaseOrderSize[] = (this.purchaseorderForm.controls["sizeIds"].value as number[]).map(x => ({ sizeId: x }))
    // const purchaseorderImages: PurchaseOrderImage[] = this.listImage.map(x => ({ imageUrl: x.url }));

    let purchaseorder: PurchaseOrder = {
      totalPrice: this.getTotalPrice(),
      orderDate: new Date(),
      status: OrderStatus.Submitted,
      purchaseOrderDetails: this.purhcaseOrderDetails
    };

    this.isLoadingButtonSubmit = true;

    this.addPurchaseOrder(purchaseorder);
    // if (this.purchaseorderId != undefined) {
    //   purchaseorder.id = this.purchaseorderId;
    //   this.updatePurchaseOrder(purchaseorder);
    // }
    // else {
    //   
    // }
  }

  getTotalPrice() {
    return this.purhcaseOrderDetails.map(x => x.quantity * x.price).reduce((a, b) => a + b);
  }

  deleteRow(id: number): void {
    this.purhcaseOrderDetails = this.purhcaseOrderDetails.filter(d => d.id !== id);
  }

  savePO(): void {
    this.editId = -1;
  }

  startEdit(id: number): void {
    if (!this.viewMode)
      this.editId = id;
  }

  addPurchaseOrder(purchaseorder: PurchaseOrder) {
    this.purchaseorderService.create(purchaseorder)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create purchase order successfully!`);
          this.router.navigate(['/admin/inventory/purchase-orders']);
        }
      });
  }

  updatePurchaseOrder(purchaseorder: PurchaseOrder) {
    this.purchaseorderService.update(purchaseorder)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update purchaseorder successfully!`);
        }
      });
  }

  addPurchaseOrderDetail() {
    this.purhcaseOrderDetails = [
      ...this.purhcaseOrderDetails,
      {
        id: this.i,
        productName: '',
        sizeId: 0,
        colorId: 0,
        colorName: '',
        sizeName: '',
        price: 0,
        imageUrl: '',
        quantity: 0,
        productId: 0
      }
    ];


    this.editId = this.i;

    this.i++;
  }

  productChange(id: number, data: PurchaseOrderDetail) {
    const index = this.listProduct.findIndex(p => p.id == id);
    if (index !== -1) {
      data.productName = this.listProduct[index].productName;
      this.listColor = this.listProduct[index].productColors.map(c => {
        const color: Color = {
          id: c.colorId,
          colorName: c.colorName,
          colorCode: c.colorCode
        }
        return color;
      });

      this.listSize = this.listProduct[index].productSizes.map(c => {
        const size: Size = {
          id: c.sizeId,
          sizeName: c.sizeName,
        }
        return size;
      });
    }
  }
  sizeChange(sizeId: number, data: PurchaseOrderDetail) {
    const index = this.listSize.findIndex(p => p.id == sizeId);
    if (index !== -1) {
      data.sizeName = this.listSize[index].sizeName;
    }
  }

  colorChange(colorId: number, data: PurchaseOrderDetail) {
    const index = this.listColor.findIndex(p => p.id == colorId);
    if (index !== -1) {
      data.colorName = this.listColor[index].colorName;
    }
  }
}
