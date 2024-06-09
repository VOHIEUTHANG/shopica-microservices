import { CartItem } from '@core/model/cart/cart-item';
import { PromotionResult } from '../promotion/promotion-result';
export class Cart {
  customerId: number;
  totalPrice: number;
  cartItems: CartItem[];
  promotionResults: PromotionResult[];

  constructor() {
    this.customerId = 0;
    this.totalPrice = 0;
    this.promotionResults = [];
    this.cartItems = []
  }
}
