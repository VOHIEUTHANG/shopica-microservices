import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalService } from './../../../core/services/modal/modal.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ProductService } from './../../../core/services/product/product.service';
import { CartService } from './../../../core/services/cart/cart.service';
import { Router } from '@angular/router';
import { Color } from '@core/model/color/color';
import { Size } from '@core/model/size/size';
import { ShareService } from './../../../core/services/share/share.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { Product } from '../../../core/model/product/product';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductImage } from '@core/model/product/product-image';
import { getListColor, getListSize } from '@core/model/product/product-helper';
import { finalize, map } from 'rxjs/operators';
import { Cart } from '@core/model/cart/cart';
import { ProductSize } from '@core/model/product/product-size';
import { ProductColor } from '@core/model/product/product-color';
import { Wishlist } from '@core/model/product/wishlist';
import { JwtService } from '@core/services/jwt/jwt.service';
import { CartItem } from '@core/model/cart/cart-item';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent implements OnInit {
  @ViewChild('productImages', { static: false }) private productImages: NzCarouselComponent;
  isVisible = false;
  imageStyles: any;
  listSize: ProductSize[] = [];
  listColor: ProductColor[] = [];
  colorSelected: ProductColor;
  sizeSelected: ProductSize;
  product: Product;
  cart: Cart;
  isAddingToCart = false;
  isChangeWishList = false;
  inWishList = false;
  listWish: Wishlist[] = [];
  quantity = 1;
  customOptions: OwlOptions = {
    loop: false,
    autoplay: true,
    dots: false,
    skip_validateItems: true,
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true,
    navText: ['<', '>']
  };

  constructor(
    private readonly shareService: ShareService,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.shareService.cartEmitted$.subscribe((cart) => {
      this.cart = cart;
    });

    this.modalService.openQuickViewEmitted$.subscribe((product) => {
      this.product = product;
      this.isVisible = true;
      this.quantity = 1;
      this.listSize = product.productSizes;
      this.listColor = product.productColors;
      this.colorSelected = this.listColor[0];
      this.sizeSelected = this.listSize[0];
      this.setImages(product.productImages);
      this.checkWishList();
    });

    this.shareService.wishlistEmitted$.subscribe(listIds => {
      this.listWish = listIds;
      this.checkWishList();
    });
  }

  checkWishList() {
    if (this.listWish.findIndex(wl => wl.productId === this.product?.id) !== -1) {
      this.inWishList = true;
    }
    else {
      this.inWishList = false;
    }
  }

  addToWishList(productId: number) {
    if (!this.authService.isAuthenticated()) {
      this.isVisible = false;
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

  setImages(productImage: ProductImage[]) {
    this.imageStyles = productImage.map(x => { return { 'background-image': 'url("' + x.imageUrl + '")' } });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  prev() {
    this.productImages.pre();
  }

  next() {
    this.productImages.next();
  }

  viewDetail(id: number) {
    this.isVisible = false;
    this.router.navigate(['/product/detail', id]);
  }

  colorSelectEvent(color: ProductColor) {
    this.colorSelected = color;
  }

  sizeSelectEvent(size: ProductSize) {
    this.sizeSelected = size;
  }


  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.isVisible = false;
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
          let errorStr = `${this.product.productName}(${this.colorSelected.colorName} - ${this.sizeSelected.sizeName}) only has ${availableQuantity} available product`;
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
          this.isVisible = false;
          this.shareService.cartEmitEvent(res.data);
          this.modalService.openCartDrawerEvent();
        }
        else {

        }
      });
  }

  getBackgroundStyle() {
    return;
  }

}
