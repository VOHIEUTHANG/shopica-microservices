import { Wishlist } from './../../../core/model/product/wishlist';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ModalService } from './../../../core/services/modal/modal.service';
import { finalize } from 'rxjs/operators';
import { ProductService } from '@core/services/product/product.service';
import { ShareService } from './../../../core/services/share/share.service';
import { Color } from '@core/model/color/color';
import { ProductDetail } from '@core/model/product/product-detail';
import { Size } from '@core/model/size/size';
import { Product } from '@core/model/product/product';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { getListColor, getListSize } from '@core/model/product/product-helper';
import { ProductSize } from '@core/model/product/product-size';
import { ProductColor } from '@core/model/product/product-color';
import { JwtService } from '@core/services/jwt/jwt.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;
  listColor: ProductColor[] = [];
  listSize: ProductSize[] = [];
  listWish: Wishlist[] = [];
  sizeSelected: ProductSize;
  colorSelected: ProductColor;
  imageUrl: string;
  sizes = '';
  inWishList = false;
  isChangeWishList = false;
  constructor(
    private readonly shareService: ShareService,
    private readonly productService: ProductService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.shareService.wishlistEmitted$.subscribe(listIds => {
      this.listWish = listIds;
      if (listIds.findIndex(wl => wl.productId === this.product?.id) !== -1) {
        this.inWishList = true;
      }
      else {
        this.inWishList = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] != undefined && changes['product'].currentValue != undefined) {
      const product: Product = changes['product'].currentValue;
      this.listSize = product.productSizes;
      this.listColor = product.productColors;
      this.colorSelected = product.productColors[0];
      this.imageUrl = encodeURI(product.productImages[0].imageUrl);
      this.sizes = this.listSize.map(x => x.sizeName).join(', ');

    }
  }

  getBackgroundStyle() {
    return { 'background-image': 'url("' + this.imageUrl + '")' };
  }

  openQuickView(product: Product) {
    this.modalService.openQuickViewEvent(product);
  }

  openQuickShop(product: Product) {
    this.modalService.openQuickShopEvent(product);
  }

  addToWishList(productId: number) {
    if (!this.authService.isAuthenticated()) {
      this.modalService.openLoginDrawerEvent();
      return;
    }
    this.isChangeWishList = true;
    const wishlist: Wishlist = {
      productId: productId,
      customerId: this.jwtService.getUserId()
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

  removeWishList(productId: number) {
    this.isChangeWishList = true;
    this.productService.removeWishList(this.jwtService.getUserId(), productId).pipe(
      finalize(() => this.isChangeWishList = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        this.shareService.wishListEmitEvent(this.listWish.filter(x => x.productId !== productId));
      }
    });
  }
}
