import { ProductService } from '@core/services/product/product.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '@core/model/product/product';
import { Component, OnInit } from '@angular/core';
import { BaseParams } from '@core/model/base-params';

@Component({
  selector: 'app-product-top',
  templateUrl: './product-top.component.html',
  styleUrls: ['./product-top.component.css']
})
export class ProductBestSellerComponent implements OnInit {

  constructor(private readonly productService: ProductService) { }
  salesProduct: Product[] = [];
  trendingProduct: Product[] = [];
  newArrivalProduct: Product[] = [];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    skip_validateItems: true,
    responsive: {
      200: {
        items: 1
      },
      300: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  };

  ngOnInit() {
    this.getSalesProduct();
    this.getNewArrivalProduct();
    this.getTrendingProduct();
  }


  getSalesProduct() {
    const params: BaseParams = new BaseParams(1, 15);
    params.filters = [...params.filters, { key: 'tags', value: 'sales' }];
    this.productService.getListProduct(params).subscribe(res => {
      if (res.isSuccess) {
        this.salesProduct = res.data.data;
      }
    })
  }

  getTrendingProduct() {
    const params: BaseParams = new BaseParams(1, 15);
    params.filters = [...params.filters, { key: 'tags', value: 'trending' }];
    this.productService.getListProduct(params).subscribe(res => {
      if (res.isSuccess) {
        this.trendingProduct = res.data.data;
      }
    })
  }

  getNewArrivalProduct() {
    const params: BaseParams = new BaseParams(1, 15);
    params.filters = [...params.filters, { key: 'tags', value: 'new_arrival' }];
    this.productService.getListProduct(params).subscribe(res => {
      if (res.isSuccess) {
        this.newArrivalProduct = res.data.data;
      }
    })
  }
}
