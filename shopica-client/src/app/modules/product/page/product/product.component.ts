import { LoaderService } from './../../../../shared/modules/loader/loader.service';
import { Brand } from './../../../../core/model/brand/brand';
import { ProductSort } from './../../../../core/model/product/product-sort';
import { delay, finalize, switchMap, tap } from 'rxjs/operators';
import { ProductService } from './../../../../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductOptions } from './../../../../core/model/product/product-option';
import { BaseParams } from '@core/model/base-params';
import { Category } from '@core/model/category/category';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Product } from '@core/model/product/product';
import { combineLatest } from 'rxjs';
import { Sort } from '@core/model/sort';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @ViewChild('target') targetScrollTo: ElementRef;
  isShowFilter = false;
  productCol: number;
  baseParams: BaseParams = new BaseParams(1, 12);
  listProduct: Product[] = [];
  total = 0;
  countFilter = 0;
  loaded = true;

  selectedColor: string;
  selectedSize: string;
  selectedBrand: string;
  selectedPrice: string;
  currentCategory: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly loaderService: LoaderService
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ])
      .pipe(
        switchMap((data) => {
          this.getCategory(data[0]);
          this.getFilter(data[1]);
          this.loaderService.showLoader('product');
          this.loaded = false;

          return this.productService.getListProduct(this.baseParams);
        }),
      ).subscribe(res => {
        if (res.isSuccess) {
          this.listProduct = res.data.data;
          this.total = res.data.count;
        }
        this.loaderService.hideLoader('product');
        this.loaded = true;
      });

    if (window.innerWidth <= 992) {
      this.productCol = 12;
    }
    else {
      this.productCol = 6;
    }
  }

  getCategory(params) {
    this.currentCategory = params.category;

    this.changeFilterParam("categoryName", params.category);
  }

  getFilter(queryParams) {

    this.countFilter = Object.keys(queryParams).length;
    if (!queryParams.size && !queryParams.color && !queryParams.brand && !queryParams.price && !queryParams.sortField && !queryParams.sortOrder) {
      this.clearFilter();
      return;
    }

    if (queryParams.color) {
      this.selectedColor = queryParams.color;
      this.changeFilterParam("colorNames", queryParams.color);
    }

    if (queryParams.size) {
      this.selectedSize = queryParams.size;
      this.changeFilterParam("sizeNames", queryParams.size);
    }
    if (queryParams.brand) {
      this.selectedBrand = queryParams.brand;
      this.changeFilterParam("brandNames", queryParams.brand);
    }
    if (queryParams.price) {
      this.selectedPrice = queryParams.price;
      this.changeFilterParam("prices", queryParams.price);
    }
    if (queryParams.sortField) {
      this.baseParams.sortField = queryParams.sortField;
    }
    if (queryParams.sortOrder) {
      this.baseParams.sortOrder = queryParams.sortOrder;
    }
  }

  changeFilterParam(key: string, value: string) {
    const index = this.baseParams.filters.findIndex(f => f.key === key);
    if (index === -1) {
      this.baseParams.filters = [...this.baseParams.filters, { key: key, value: value }];
    }
    else {
      this.baseParams.filters[index].value = value;
    }
  }

  openFilterDrawer() {
    this.isShowFilter = true;
  }

  closeFilterDrawer() {
    this.isShowFilter = false;
  }

  changeNumProduct(numProduct: number) {
    this.productCol = 24 / numProduct;
  }

  loadListProduct() {
    this.loaderService.showLoader('product');
    this.productService.getListProduct(this.baseParams).pipe(
      finalize(() => this.loaderService.hideLoader('product'))
    ).subscribe(res => {
      if (res.isSuccess) {
        this.listProduct = res.data.data;
        this.total = res.data.count;
      }
    });
  }

  changePageIndex(page: number) {

    this.baseParams.pageIndex = page;
    this.targetScrollTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.loadListProduct();
  }

  // sortChangeValue(value: Sort) {

  //   this.baseParams.sortField = value.key;
  //   this.baseParams.sortOrder = value.value;
  //   this.loadListProduct();
  // }

  clearAllFilter() {
    this.router.navigate(['/product/collection', this.currentCategory]);
    this.clearFilter();
  }

  clearFilter() {
    this.baseParams.sortField = null;
    this.baseParams.sortOrder = null;
    this.baseParams.filters = this.baseParams.filters.filter(f => !['sizeNames', 'colorNames', 'brandNames', 'prices'].includes(f.key));
    this.selectedBrand = '';
    this.selectedColor = '';
    this.selectedSize = '';
    this.selectedPrice = '';
  }

  clearSize() {
    this.router.navigate(['/product/collection', this.currentCategory], {
      queryParams: {
        size: null,
      },
      queryParamsHandling: 'merge'
    });
    this.baseParams.filters = this.baseParams.filters.filter(f => f.key !== 'sizeNames');
    this.selectedSize = '';
  }

  clearColor() {
    this.router.navigate(['/product/collection', this.currentCategory], {
      queryParams: {
        color: null,
      },
      queryParamsHandling: 'merge'
    });
    this.baseParams.filters = this.baseParams.filters.filter(f => f.key !== 'colorNames');
    this.selectedColor = '';
  }

  clearBrand() {
    this.router.navigate(['/product/collection', this.currentCategory], {
      queryParams: {
        brand: null,
      },
      queryParamsHandling: 'merge'
    });
    this.baseParams.filters = this.baseParams.filters.filter(f => f.key !== 'brandNames');
    this.selectedBrand = '';
  }

  clearPrice() {
    this.router.navigate(['/product/collection', this.currentCategory], {
      queryParams: {
        price: null,
      },
      queryParamsHandling: 'merge'
    });
    this.baseParams.filters = this.baseParams.filters.filter(f => f.key !== 'prices');
    this.selectedPrice = '';
  }
}
