import { map } from 'rxjs/operators';
import { ProductService } from './../../../../core/services/product/product.service';

import { CartItemOptions } from '@shared/modules/cart-item/models/cart-item-options.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '@core/services/blog/blog.service';
import { CartItem } from '@core/model/cart/cart-item';
import { Blog } from '@core/model/blog/blog';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { BaseParams } from '@core/model/base-params';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  listBlog: Blog[];
  tags: string[];
  bestSellerProducts: CartItem[] = [];
  currentTags: string[] = [];

  cartItemOptions: CartItemOptions = {
    showPrice: true,
    size: 'small'
  };

  constructor(
    private readonly blogService: BlogService,
    private readonly checkoutService: CheckoutService,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadDataForSideBar();
    this.loadBestSellerProduct();

    this.activatedRoute.queryParams.subscribe(params => {
      this.currentTags = params.tags !== undefined ? (params.tags as string).split(',') : [];
    });
  }

  loadBestSellerProduct() {
    this.checkoutService.getBestSeller().subscribe(res => {
      if (res.isSuccess) {
        const productIds = res.data.slice(0, 3).map(x => x.productId).join(',');
        this.productService.getProductByIds(productIds).subscribe(res => {
          if (res.isSuccess) {
            this.bestSellerProducts = res.data.map(p => {
              return {
                productId: p.id,
                productName: p.productName,
                price: p.price,
                quantity: 1,
                unitPrice: p.price,
                colorId: p.productColors[0].colorId,
                colorName: p.productColors[0].colorName,
                sizeId: p.productSizes[0].sizeId,
                sizeName: p.productSizes[0].sizeName,
                imageUrl: p.productImages[0].imageUrl
              }
            });
          }
        });
      }
    })
  }

  loadDataForSideBar() {
    this.blogService.getBlogTags().subscribe((res) => {
      if (res.isSuccess)
        this.tags = res.data;
    });
    const param = new BaseParams(1, 2);

    param.sortField = 'createdAt';
    param.sortOrder = 'descend';
    this.blogService.getAllBlog(param).subscribe((res) => {
      if (res.isSuccess)
        this.listBlog = res.data.data;
    });
  }

  viewItem(id: number) {
    this.router.navigate(['/blog/detail/', id]);
  }

  filterChange(tag: string) {

    if (this.currentTags.indexOf(tag) !== -1) {
      this.currentTags = this.currentTags.filter(c => c !== tag);
    }
    else {
      this.currentTags = [...this.currentTags, tag];
    }

    this.router.navigate(['/blog'],
      {
        queryParams: {
          tags: this.currentTags.length > 0 ? this.currentTags.join(',') : null
        },
        queryParamsHandling: 'merge'
      });
  }

}
