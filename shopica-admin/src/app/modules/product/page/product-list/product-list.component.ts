import { Router } from '@angular/router';
import { ProductImage } from './../../model/product-image';
import { ProductSearch } from './../../model/product-search';
import { BaseParams } from './../../../common/base-params';
import { finalize } from 'rxjs/operators';
import { BrandService } from './../../../brand/services/brand.service';
import { CategoryService } from './../../../category/services/category.service';
import { Category } from './../../../category/models/category';
import { ProductService } from './../../services/product.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../model/product';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Brand } from '@app/modules/brand/models/brand';
import { NumberFormatStyle } from '@angular/common';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  filterParams = new BaseParams(1, 5);
  productSearch = new ProductSearch();
  listData: Product[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
    private readonly nzImageService: NzImageService,
    private readonly router: Router,
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
      this.baseParam.filters = [{ key: "productName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.productService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showListImage(listImages: ProductImage[]) {
    let listNzImages: NzImage[] = [];
    listImages.forEach(item => {
      listNzImages.push({
        src: item.imageUrl
      });
    })

    this.nzImageService.preview(listNzImages, { nzZoom: 1, nzRotate: 0 })
  }

  editProduct(product: Product) {
    this.router.navigate(['/admin/product/detail', product.id]);
  }

  addProduct() {
    this.router.navigate(['/admin/product/add']);
  }


  deleteProduct(id: number) {
    this.isLoading = true;
    this.productService.delete(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        if (this.listData.length == 1 && this.total > 1)
          this.baseParam.pageIndex -= 1;
        this.loadDataFromServer(this.baseParam);

      }
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

}
