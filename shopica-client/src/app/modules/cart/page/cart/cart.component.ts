import { ProductService } from './../../../../core/services/product/product.service';
import { LoaderService } from './../../../../shared/modules/loader/loader.service';
import { finalize, delay } from 'rxjs/operators';
import { CartService } from './../../../../core/services/cart/cart.service';
import { ShareService } from './../../../../core/services/share/share.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Cart } from '../../../../core/model/cart/cart';
import { Product } from '@core/model/product/product';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart;
  initialLoading = true;
  disableGotoCheckout = false;
  listProduct: Product[] = [];
  customOptions: OwlOptions = {
    loop: false,
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
  constructor(
    private readonly shareService: ShareService,
    private readonly loaderService: LoaderService,
    private readonly productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.loaderService.showLoader('cart-page');
    this.shareService.cartEmitted$.subscribe((cart) => {
      this.cart = cart;
      this.loaderService.hideLoader('cart-page');
      this.initialLoading = false;
      // this.disableGotoCheckout = this.cart.cartItems.filter(x => x.quantity <= x.available).length == 0

    });

    // this.getRecommenderProducts();
  }

  loadingEvent(isLoad: boolean) {
    isLoad
      ? this.loaderService.showLoader('cart-item')
      : this.loaderService.hideLoader('cart-item');
  }

  getRecommenderProducts() {
    this.productService.getProductRecommender().subscribe(res => {
      this.listProduct = res;
    })
  }

  getTotalPrice() {
    return this.cart.cartItems.map(x => x.unitPrice * x.quantity).reduce((a, b) => a + b);
  }
}
