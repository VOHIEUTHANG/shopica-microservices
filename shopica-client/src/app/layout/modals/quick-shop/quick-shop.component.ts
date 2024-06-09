import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalService } from './../../../core/services/modal/modal.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { finalize } from 'rxjs/operators';
import { CartService } from './../../../core/services/cart/cart.service';
import { Router } from '@angular/router';
import { CartItemOptions } from '@shared/modules/cart-item/models/cart-item-options.model';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Color } from '@core/model/color/color';
import { Size } from '@core/model/size/size';
import { ProductDetail } from '@core/model/product/product-detail';
import { ShareService } from './../../../core/services/share/share.service';
import { Product } from '../../../core/model/product/product';
import { Component, OnInit } from '@angular/core';
import { getListColor, getListSize } from '@core/model/product/product-helper';
import { Cart } from '@core/model/cart/cart';
import { ProductColor } from '@core/model/product/product-color';
import { ProductSize } from '@core/model/product/product-size';
import { JwtService } from '@core/services/jwt/jwt.service';
import { CartItem } from '@core/model/cart/cart-item';
import { UpdateCartItemRequest } from '@core/model/cart/update-cart-item-request';
import { OldCartItem } from '@core/model/cart/old-cart-item';
import { ProductService } from '@core/services/product/product.service';

@Component({
  selector: 'app-quick-shop',
  templateUrl: './quick-shop.component.html',
  styleUrls: ['./quick-shop.component.css']
})
export class QuickShopComponent implements OnInit {
  isVisible = false;
  product: Product;
  listSize: ProductSize[] = [];
  listColor: ProductColor[] = [];
  colorSelected: ProductColor;
  sizeSelected: ProductSize;
  cartItem: CartItem;
  oldCartItem: OldCartItem;
  quantity = 1;
  isAddingToCart = false;
  editMode: boolean;
  cartItemOptions: CartItemOptions = {
    size: 'small'
  };
  cart: Cart;

  constructor(
    private readonly shareService: ShareService,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly modalService: ModalService,
    private readonly messageService: NzMessageService,
    private readonly jwtService: JwtService,
    private readonly productService: ProductService
  ) { }


  ngOnInit(): void {
    this.shareService.cartEmitted$.subscribe((cart) => {
      this.cart = cart;
    });

    this.addToCartMode();
    this.editCartMode();
    this.closeQuickShop();
  }

  closeQuickShop() {
    this.modalService.closeQuickShopEmitted$.subscribe(data => {
      this.isVisible = false;
    });
  }

  editCartMode() {
    this.shareService.editCartItemEmitted$.subscribe(oldCartItem => {
      this.oldCartItem = oldCartItem;
      this.editMode = true;
      this.quantity = oldCartItem.quantity;
      this.colorSelected = this.listColor.filter(x => x.colorId == oldCartItem.colorId)[0];
      this.sizeSelected = this.listSize.filter(x => x.sizeId == oldCartItem.sizeId)[0];
    });
  }

  addToCartMode() {
    this.modalService.openQuickShopEmitted$.subscribe((product) => {
      this.product = product;
      this.isVisible = true;
      this.listSize = product.productSizes;
      this.listColor = product.productColors;
      this.colorSelected = this.listColor[0];
      this.sizeSelected = this.listSize[0];
      this.setCartItem(product);
      this.quantity = 1;
      this.editMode = false;
    });
  }

  setCartItem(product: Product) {
    this.cartItem = {
      colorId: this.colorSelected.colorId,
      sizeId: this.sizeSelected.sizeId,
      colorName: this.colorSelected.colorName,
      sizeName: this.sizeSelected.sizeName,
      quantity: 1,
      unitPrice: product.price,
      productName: product.productName,
      imageUrl: product.productImages[0].imageUrl,
      productId: product.id
    };
  }

  handleCancel() {
    this.isVisible = false;
  }

  viewDetail(id: number) {
    this.isVisible = false;
    this.router.navigate(['/product/detail', id]);
  }

  saveChangeCart() {
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

        this.editMode ? this.editCart() : this.addToCart();
      }
    })

  }

  addToCart() {
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
      imageUrl: this.product.productImages[0].imageUrl,
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
      });
  }

  editCart() {
    const body: UpdateCartItemRequest = {
      customerId: this.jwtService.getUserId(),
      productId: this.product.id,
      productName: this.product.productName,
      quantity: this.quantity,
      unitPrice: this.product.price,
      colorId: this.colorSelected.colorId,
      oldColorId: this.oldCartItem.colorId,
      oldSizeId: this.oldCartItem.sizeId,
      colorName: this.colorSelected.colorName,
      sizeId: this.sizeSelected.sizeId,
      sizeName: this.sizeSelected.sizeName,
      imageUrl: this.product.productImages[0].imageUrl,
    };

    this.isAddingToCart = true;
    this.cartService.updateCart(body)
      .pipe(
        finalize(() => this.isAddingToCart = false)
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.isVisible = false;
          this.shareService.cartEmitEvent(res.data);
        }
      });
  }

}
