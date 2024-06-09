import { Component } from '@angular/core';
import { WarehouseEntry, WarehouseEntrySourceDocument } from '../../models/warehouse-entry';
import { BaseParams } from '@app/modules/common/base-params';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { ProductService } from '@app/modules/product/services/product.service';
import { PurchaseOrder } from '../../models/purchase-order';
import { OrderStatus } from '@app/modules/order/model/order';
import { PurchaseOrderDetail } from '../../models/purchase-order-detail';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-warehouse-entry-list',
  templateUrl: './warehouse-entry-list.component.html',
  styleUrl: './warehouse-entry-list.component.css'
})
export class WarehouseEntryListComponent {
  filterParams = new BaseParams(1, 5);
  listData: WarehouseEntry[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);
  public sourceDocument = WarehouseEntrySourceDocument;

  filterSource = [
    { text: 'SalesOrder', value: WarehouseEntrySourceDocument.SalesOrder },
    { text: 'PurchaseOrder', value: WarehouseEntrySourceDocument.PurchaseOrder },
  ];

  constructor(
    private readonly warehouseentryService: PurchaseOrderService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly purchaseorderService: PurchaseOrderService,
    private readonly messageService: NzMessageService
  ) {

  }
  selectedValue = null;

  ngOnInit(): void {
  }

  onQueryParamsChange = (params: NzTableQueryParams) => {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);

    this.baseParam.pageIndex = pageIndex;
    this.baseParam.pageSize = pageSize;
    this.baseParam.sortField = (currentSort && currentSort.key) || undefined;
    this.baseParam.sortOrder = (currentSort && currentSort.value) || undefined;
    this.baseParam.filters = filter.filter(f => f.value.length > 0);


    if (this.searchValue !== '') {
      this.baseParam.filters = [{ key: "warehouseentryName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.warehouseentryService.getWarehouseEntries(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }


  reset(): void {
    this.visible = false;
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'productName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'productName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }

  initialInventory() {
    this.productService.getAll(new BaseParams(1, 50)).subscribe(res => {
      if (res.isSuccess) {
        let i = 1;
        let purchaseOrderDetails: PurchaseOrderDetail[] = [];

        res.data.data.forEach(p => {
          p.productSizes.forEach(ps => {
            p.productColors.forEach(pc => {
              purchaseOrderDetails = [...purchaseOrderDetails, {
                id: i,
                productName: p.productName,
                sizeId: ps.sizeId,
                colorId: pc.colorId,
                colorName: pc.colorName,
                sizeName: ps.sizeName,
                price: p.price,
                imageUrl: p.productImages[0].imageUrl,
                quantity: 10000,
                productId: p.id
              }]
              i++;
            })
          });
        })

        let purchaseorder: PurchaseOrder = {
          totalPrice: purchaseOrderDetails.map(x => x.quantity * x.price).reduce((a, b) => a + b),
          orderDate: new Date(),
          status: OrderStatus.Submitted,
          purchaseOrderDetails: purchaseOrderDetails
        };

        this.purchaseorderService.create(purchaseorder)
          .subscribe((res) => {
            if (res.isSuccess) {
              this.messageService.create('success', `Init inventory successfully!`);
            }
          });
      }
    })
  }

}
