import { ProductService } from '@modules/product/services/product.service';
import { finalize, map } from 'rxjs/operators';
import { BaseParams } from '@modules/common/base-params';
import { BrandService } from '@modules/brand/services/brand.service';
import { CategoryService } from '@modules/category/services/category.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Brand } from '@modules/brand/models/brand';
import { Category } from '@modules/category/models/category';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env';
import { Product } from '../../model/product';
import { Size } from '@app/modules/size/models/size';
import { SizeService } from '@app/modules/size/services/size.service';
import { ColorService } from '@app/modules/color/services/color.service';
import { Color } from '@app/modules/color/models/Color';
import { ProductColor } from '../../model/product-color';
import { ProductSize } from '../../model/product-size';
import { ProductImage } from '../../model/product-image';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  backEndUrl = `${environment.gatewayServiceUrl}/api/product/import`;
  isLoadingCategoryInSelect = true;
  isLoadingBrandInSelect = true;
  isLoadingProductEdit = false;
  isLoadingButtonSubmit = false;

  listCategory: Category[];
  listBrand: Brand[];
  listSize: Size[];
  listColor: Color[];
  productForm: UntypedFormGroup;
  params = new BaseParams(1, 5);

  //image
  listImage: NzUploadFile[] = [];

  //productDetail
  tags: string[] = [];

  sizeIdsSelected: number[] = [];
  colorIdsSelected: number[] = [];
  productId: number;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly sizeService: SizeService,
    private readonly colorService: ColorService,
    private readonly productService: ProductService,
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadCategory();
    this.loadBrand();
    this.loadSize();
    this.loadColor();

    this.getProductTags();

    //edit mode
    this.activatedRoute.params.subscribe(params => {
      if (params.productId) {
        this.productId = params.productId
        this.loadProductEdit(this.productId);
      }
    });
  }

  getProductTags() {
    this.productService.getProductTags().subscribe((res) => {
      this.tags = res.data
    })
  }

  loadProductEdit(productId: number) {
    this.isLoadingProductEdit = true;
    this.productService.getById(productId).pipe(
      finalize(() => this.isLoadingProductEdit = false)
    )
      .subscribe(res => {
        if (res.isSuccess) {
          const product = res.data;
          this.productForm.controls['productName'].setValue(product.productName);
          this.productForm.controls['price'].setValue(product.price);
          this.productForm.controls['categoryId'].setValue(product.categoryId);
          this.productForm.controls['brandId'].setValue(product.brandId);
          this.productForm.controls['tags'].setValue(product.tags);
          this.productForm.controls['sizeIds'].setValue(product.productSizes.map(x => x.sizeId));
          this.productForm.controls['colorIds'].setValue(product.productColors.map(x => x.colorId));

          this.listImage = product.productImages.map((productImage, index) => {
            return {
              uid: productImage.id.toString(),
              url: productImage.imageUrl,
              name: new URL(productImage.imageUrl).pathname.split('/').pop(),
            };
          });
        }
      });
  }

  loadColorSizeSelected(productDetails) {
    const sizeIds = new Set<number>();
    const colorIds = new Set<number>();
    productDetails.forEach(item => {
      sizeIds.add(item.sizeId);
      colorIds.add(item.colorId);
    });
    this.colorIdsSelected = [...colorIds];
    this.sizeIdsSelected = [...sizeIds];
  }


  buildForm() {
    this.productForm = this.formBuilder.group({
      productName: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      brandId: [null, Validators.required],
      categoryId: [null, Validators.required],
      sizeIds: [null, Validators.required],
      colorIds: [null, Validators.required],
      tags: [null, [Validators.required]]
    })
  }

  loadCategory() {
    this.params.pageSize = 50;
    this.categoryService.getAll(this.params).pipe(
      finalize(() => this.isLoadingCategoryInSelect = false)
    ).subscribe(
      res => {
        if (res.isSuccess) {
          this.listCategory = res.data.data;
        }
      }
    )
  }

  loadBrand() {
    this.params.pageSize = 50;
    this.brandService.getAll(this.params).pipe(
      finalize(() => this.isLoadingBrandInSelect = false)
    ).subscribe(
      res => {
        if (res.isSuccess) {
          this.listBrand = res.data.data;
        }
      }
    )
  }

  loadSize() {
    this.params.pageSize = 50;
    this.sizeService.getAll(this.params).pipe(
      finalize(() => this.isLoadingBrandInSelect = false)
    ).subscribe(
      res => {
        if (res.isSuccess) {
          this.listSize = res.data.data;
        }
      }
    )
  }


  loadColor() {
    this.params.pageSize = 50;
    this.colorService.getAll(this.params).pipe(
      finalize(() => this.isLoadingBrandInSelect = false)
    ).subscribe(
      res => {
        if (res.isSuccess) {
          this.listColor = res.data.data;
        }
      }
    )
  }

  submitForm() {
    const productColors: ProductColor[] = (this.productForm.controls["colorIds"].value as number[]).map(x => ({ colorId: x }))
    const productSizes: ProductSize[] = (this.productForm.controls["sizeIds"].value as number[]).map(x => ({ sizeId: x }))
    const productImages: ProductImage[] = this.listImage.map(x => ({ imageUrl: x.url }));

    let product: Product = {
      productName: this.productForm.controls["productName"].value,
      price: this.productForm.controls["price"].value,
      categoryId: this.productForm.controls["categoryId"].value,
      brandId: this.productForm.controls["brandId"].value,
      tags: this.productForm.controls["tags"].value,
      productImages: productImages,
      productColors: productColors,
      productSizes: productSizes,
    };

    this.isLoadingButtonSubmit = true;

    if (this.productId != undefined) {
      product.id = this.productId;
      this.updateProduct(product);
    }
    else {
      this.addProduct(product);
    }
  }


  addProduct(product: Product) {
    this.productService.create(product)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create product successfully!`);
          this.router.navigate(['/admin/product']);
        }
      });
  }

  updateProduct(product: Product) {
    this.productService.update(product)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update product successfully!`);
        }
      });
  }
}
