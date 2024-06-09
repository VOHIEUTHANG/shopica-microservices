import { ProductService } from '@core/services/product/product.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '@core/model/product/product';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { throwError } from 'rxjs';
import { CheckoutService } from '@core/services/checkout/checkout.service';

@Component({
  selector: 'app-product-trending',
  templateUrl: './product-trending.component.html',
  styleUrls: ['./product-trending.component.css']
})
export class ProductTrendingComponent implements OnInit {

  constructor(private readonly productService: ProductService,
    private readonly checkoutService: CheckoutService
  ) { }
  listProduct: Product[] = [];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    skip_validateItems: true,
    responsive: {
      200: {
        items: 2
      },
      600: {
        items: 3
      },
      768: {
        items: 4
      }
    },
    nav: true,
    navText: ['<', '>']
  };

  ngOnInit() {
    this.checkoutService.getBestSeller().subscribe(res => {
      if (res.isSuccess) {
        const productIds = res.data.map(x => x.productId).join(',');
        this.productService.getProductByIds(productIds).subscribe(res => {
          if (res.isSuccess) {
            this.listProduct = res.data;
          }
        });
      }
    })
  }
}
