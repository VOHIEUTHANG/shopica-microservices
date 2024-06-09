import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalService } from './../../../core/services/modal/modal.service';
import { Router } from '@angular/router';
import { OldCartItem } from './../../../core/model/cart/old-cart-item';
import { ProductService } from './../../../core/services/product/product.service';
import { ShareService } from './../../../core/services/share/share.service';
import { finalize } from 'rxjs/operators';
import { CartService } from './../../../core/services/cart/cart.service';
import { CartItemOptions } from './models/cart-item-options.model';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '@core/model/cart/cart-item';
import { JwtService } from '@core/services/jwt/jwt.service';
import { UpdateCartItemRequest } from '@core/model/cart/update-cart-item-request';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem: CartItem;
  @Input() cartItemOptions: CartItemOptions;
  @Output() loadingEvent = new EventEmitter<boolean>();
  constructor(
    private readonly cartService: CartService,
    private readonly shareService: ShareService,
    private readonly productService: ProductService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly jwtService: JwtService
  ) { }
  ngOnInit(): void {

  }

  viewProductDetail(id: number) {
    this.modalService.closeCartDrawerEvent();
    this.modalService.closeQuickShopEvent();
    this.modalService.closeQuickViewEvent();
    this.router.navigate(['/product/detail', id]);
  }

  changeQuantity(quantity: number) {
    const body: UpdateCartItemRequest = {
      customerId: this.jwtService.getUserId(),
      productId: this.cartItem.productId,
      productName: this.cartItem.productName,
      quantity: quantity,
      unitPrice: this.cartItem.unitPrice,
      colorId: this.cartItem.colorId,
      oldColorId: this.cartItem.colorId,
      colorName: this.cartItem.colorName,
      sizeId: this.cartItem.sizeId,
      oldSizeId: this.cartItem.sizeId,
      sizeName: this.cartItem.sizeName,
      imageUrl: this.cartItem.imageUrl
    };

    this.loadingEvent.emit(true);
    this.cartService.updateCart(body)
      .pipe(
        finalize(() => this.loadingEvent.emit(false))
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.cartItem.quantity = quantity;
          this.shareService.cartEmitEvent(res.data);
        }
      });
  }

  deleteItem() {
    this.loadingEvent.emit(true);
    this.cartService.deleteCartItem(this.jwtService.getUserId(), this.cartItem.productId, this.cartItem.sizeId, this.cartItem.colorId)
      .pipe(
        finalize(() => this.loadingEvent.emit(false))
      )
      .subscribe(res => {
        if (res.isSuccess) {
          this.shareService.deleteCartItemEvent(this.cartItem);
        }
      });
  }

  editItem() {

    this.loadingEvent.emit(true);
    this.productService.getProductById(this.cartItem.productId)
      .pipe(
        finalize(() => this.loadingEvent.emit(false))
      )
      .subscribe(res => {
        if (res.isSuccess) {
          this.modalService.openQuickShopEvent(res.data);
          const data: OldCartItem = {
            productId: this.cartItem.productId,
            quantity: this.cartItem.quantity,
            sizeId: this.cartItem.sizeId,
            colorId: this.cartItem.colorId
          };
          this.shareService.editCartItemEvent(data);
        }
      });
  }
}
