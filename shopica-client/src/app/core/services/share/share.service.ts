import { ShippingAddress } from '../../model/address/shipping-address';
import { Customer } from '@core/model/user/customer';
import { OldCartItem } from './../../model/cart/old-cart-item';
import { Cart } from './../../model/cart/cart';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '@core/model/cart/cart-item';
import { Wishlist } from '@core/model/product/wishlist';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private authenticateSource = new BehaviorSubject<boolean>(false);
  private gotoCartPage = new Subject<boolean>();

  private cart = new BehaviorSubject<Cart>(new Cart());
  private wishlist = new BehaviorSubject<Wishlist[]>([]);
  private editCartItem = new Subject<OldCartItem>();
  private deleteCartItem = new Subject<CartItem>();
  private customerInfo = new BehaviorSubject<Customer>(null);

  authenticateSourceEmitted$ = this.authenticateSource.asObservable();
  gotoCartPageEmitted$ = this.gotoCartPage.asObservable();


  cartEmitted$ = this.cart.asObservable();
  wishlistEmitted$ = this.wishlist.asObservable();
  editCartItemEmitted$ = this.editCartItem.asObservable();
  deleteCartItemEmitted$ = this.deleteCartItem.asObservable();
  customerInfoEmitted$ = this.customerInfo.asObservable();

  authenticateEvent(isLogin: boolean) {
    this.authenticateSource.next(isLogin);
  }

  changeGotoCartPage(isGotoPage: boolean) {
    this.gotoCartPage.next(isGotoPage);
  }

  cartEmitEvent(cart: Cart) {
    this.cart.next(cart);
  }

  wishListEmitEvent(wishList: Wishlist[]) {
    this.wishlist.next(wishList);
  }

  editCartItemEvent(cartItem: OldCartItem) {
    this.editCartItem.next(cartItem);
  }

  deleteCartItemEvent(cartItem: CartItem) {
    this.deleteCartItem.next(cartItem);
  }

  customerInfoChangeEvent(customer: Customer) {
    this.customerInfo.next(customer);
  }

  constructor() { }
}
