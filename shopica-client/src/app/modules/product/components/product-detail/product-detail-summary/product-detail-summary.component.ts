import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { ModalService } from './../../../../../core/services/modal/modal.service';
import { Router } from '@angular/router';
import { ProductService } from './../../../../../core/services/product/product.service';
import { ShareService } from './../../../../../core/services/share/share.service';
import { CartService } from './../../../../../core/services/cart/cart.service';
import { environment } from '@env';
import { GhnService } from '@core/services/ghn/ghn.service';
import { Address } from '@core/model/address/address';
import { AuthService } from '@core/services/auth/auth.service';
import { Size } from '@core/model/size/size';
import { Color } from '@core/model/color/color';
import { Product } from '@core/model/product/product';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { getListColor, getListSize } from '@core/model/product/product-helper';
import { Cart } from '@core/model/cart/cart';
import { JwtService } from '@core/services/jwt/jwt.service';
import { ProductColor } from '@core/model/product/product-color';
import { ProductSize } from '@core/model/product/product-size';
import { Wishlist } from '@core/model/product/wishlist';
import { CartItem } from '@core/model/cart/cart-item';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { AddressService } from '@core/services/address/address.service';

@Component({
  selector: 'app-product-detail-summary',
  templateUrl: './product-detail-summary.component.html',
  styleUrls: ['./product-detail-summary.component.css']
})
export class ProductDetailSummaryComponent implements OnInit {
  @Input() product: Product;
  @Input() ratting: number;
  userAddress: Address;
  storeAddress: Address;
  listColor: ProductColor[] = [];
  listSize: ProductSize[] = [];
  colorSelected: ProductColor;
  sizeSelected: ProductSize;
  cart: Cart;
  listObservable: Observable<any>[] = [];
  date = new Date();
  shippingFee: number;
  quantity: number;
  isAddingToCart = false;
  isChangeWishList = false;
  inWishList = false;
  listWish: Wishlist[] = [];

  constructor(
    private readonly ghnService: GhnService,
    private readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly shareService: ShareService,
    private readonly productService: ProductService,
    private readonly checkoutService: CheckoutService,
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly jwtService: JwtService,
    private readonly addressService: AddressService
  ) { }

  ngOnInit(): void {
    this.shareService.cartEmitted$.subscribe((cart) => {
      this.cart = cart;
    });

    this.shareService.wishlistEmitted$.subscribe(listIds => {
      this.listWish = listIds;
      if (listIds.findIndex(wl => wl.productId === this.product.id) !== -1) {
        this.inWishList = true;
      }
      else {
        this.inWishList = false;
      }
    });


    combineLatest([
      this.checkoutService.getStoreAddress(),
      this.addressService.getAddressDefault(this.jwtService.getUserId())
    ]).subscribe(res => {
      if (res[0].isSuccess)
        this.storeAddress = res[0].data;
      if (res[1].isSuccess)
        this.userAddress = res[1].data;

      this.calculateShippingFee();
    });

  }

  addToWishList(productId: number) {
    if (!this.authService.isAuthenticated()) {
      this.modalService.openLoginDrawerEvent();
      return;
    }

    if (this.inWishList) {
      this.router.navigate(['/product/wishlist']);
      return;
    }

    this.isChangeWishList = true;

    const wishlist: Wishlist = {
      customerId: this.jwtService.getUserId(),
      productId: productId
    }
    this.productService.addToWishList(wishlist)
      .pipe(
        finalize(() => this.isChangeWishList = false)
      ).subscribe(res => {
        if (res.isSuccess) {
          this.listWish.push(res.data);
          this.shareService.wishListEmitEvent(this.listWish);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.product !== undefined) {
      const product: Product = changes.product.currentValue;
      this.listSize = product.productSizes;
      this.listColor = product.productColors;
      this.colorSelected = this.listColor[0];
      this.sizeSelected = this.listSize[0];
      this.quantity = 1;
    }

  }

  getShippingAddress() {
    this.checkoutService.getStoreAddress()
      .subscribe(res => {
        if (res.isSuccess) {
          this.storeAddress = res.data;
        }
      })
  }

  calculateShippingFee() {
    if (this.userAddress && this.storeAddress) {
      this.ghnService.calculateShippingFee(this.userAddress.districtId, this.storeAddress.districtId)
        .subscribe(res => {
          if (res.code == 200) {
            this.shippingFee = res.data.total / environment.USDToVND;
          }
        });

    }
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.modalService.openLoginDrawerEvent();
      return;
    }

    this.productService.getAvailableQuantity(this.product.id, this.sizeSelected.sizeId, this.colorSelected.colorId).subscribe(res => {
      if (res.isSuccess) {
        const availableQuantity = res.data;
        const inCartQuantity = this.cart.cartItems.filter(item => item.productId === this.product.id
          && item.sizeId == this.sizeSelected.sizeId
          && item.colorId == this.colorSelected.colorId
        ).reduce((sum, current) => sum + current.quantity, 0);

        if (this.quantity + inCartQuantity > availableQuantity) {
          let errorStr = `${this.product.productName}(${this.colorSelected.colorName} - ${this.sizeSelected.sizeName}) only has ${availableQuantity} available products`;
          errorStr += inCartQuantity > 0 ? `Your cart has ${inCartQuantity} product.` : "";
          this.messageService.error(errorStr)
          return;
        }

        this.addToCartRequest();
      }
    })

  }

  addToCartRequest() {
    const request: CartItem = {
      customerId: this.jwtService.getUserId(),
      productId: this.product.id,
      productName: this.product.productName,
      quantity: this.quantity,
      unitPrice: this.product.price,
      colorId: this.colorSelected.colorId,
      colorName: this.colorSelected.colorName,
      sizeId: this.sizeSelected.sizeId,
      sizeName: this.sizeSelected.sizeName,
      imageUrl: this.product.productImages[0].imageUrl
    };

    this.isAddingToCart = true;
    this.cartService.addToCart(request)
      .pipe(
        finalize(() => this.isAddingToCart = false)
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.shareService.cartEmitEvent(res.data);
          this.modalService.openCartDrawerEvent();
        }
      });
  }
}
