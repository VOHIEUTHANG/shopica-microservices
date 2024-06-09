import { finalize } from 'rxjs/operators';
import { LoaderService } from './../../../../shared/modules/loader/loader.service';
import { ProductService } from '@core/services/product/product.service';
import { Product } from '@core/model/product/product';
import { Component, OnInit } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { ShareService } from '@core/services/share/share.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  listProduct: Product[] = [];
  constructor(
    private readonly productService: ProductService,
    private readonly loaderService: LoaderService,
    private readonly shareService: ShareService
  ) { }

  ngOnInit(): void {
    this.shareService.wishlistEmitted$.subscribe(wishlist => {
      const productIds = wishlist.map(X => X.productId).join(",");
      this.loaderService.showLoader('wishlist');
      this.productService.getProductByIds(productIds)
        .pipe(
          finalize(() => this.loaderService.hideLoader('wishlist'))
        ).subscribe(res => {
          if (res.isSuccess) {
            this.listProduct = res.data;
          }
        });
    });
  }

}
