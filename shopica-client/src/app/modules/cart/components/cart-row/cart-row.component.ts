import { ShareService } from '@core/services/share/share.service';
import { CartService } from './../../../../core/services/cart/cart.service';
import { CartItemOptions } from '@shared/modules/cart-item/models/cart-item-options.model';
import { CartItem } from '@core/model/cart/cart-item';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { JwtService } from '@core/services/jwt/jwt.service';
import { UpdateCartItemRequest } from '@core/model/cart/update-cart-item-request';

@Component({
  selector: 'app-cart-row',
  templateUrl: './cart-row.component.html',
  styleUrls: ['./cart-row.component.css']
})
export class CartRowComponent implements OnInit {

  @Input() cartItem: CartItem;
  @Input() mode: string;
  @Output() isLoading = new EventEmitter<boolean>();
  cartItemOptions: CartItemOptions = {
    showActions: false,
    showSize: true,
    showColor: true,
  };

  constructor(
    private readonly cartService: CartService,
    private readonly shareService: ShareService,
    private readonly jwtService: JwtService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes): void {
    if (changes.mode !== undefined && changes.mode.currentValue === 'cart') {
      this.cartItemOptions.showActions = true;
      this.cartItemOptions.size = 'large';
    }
  }

  loadingEvent(isLoad: boolean) {
    this.isLoading.emit(isLoad);
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

    this.loadingEvent(true);
    this.cartService.updateCart(body)
      .pipe(
        finalize(() => this.loadingEvent(false))
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.cartItem.quantity = quantity;
          this.shareService.cartEmitEvent(res.data);
        }
      });
  }
}
