import { Router } from '@angular/router';
import { ShareService } from '../../../../core/services/share/share.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from '@core/model/cart/cart';
import { CartItem } from '@core/model/cart/cart-item';
import { Order, OrderStatus } from '@core/model/order/order';
import { OrderDetail } from '@core/model/order/order-details';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { InformationComponent } from '@modules/checkout/components/information/information.component';
import { PaymentComponent } from '@modules/checkout/components/payment/payment.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { LoaderService } from '@shared/modules/loader/loader.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild(InformationComponent) informationComponent: InformationComponent;

  cart: Cart;
  orderDetails: OrderDetail[] = [];
  discount = 0;
  shippingPrice = 0;
  constructor(
    private readonly shareService: ShareService,
    private readonly checkoutService: CheckoutService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.getCart();
    this.shareService.changeGotoCartPage(true);

    this.checkoutService.discountEmitted$.subscribe((discount: number) => {
      this.discount = discount;
    });

    this.checkoutService.shippingPriceEmitted$.subscribe((shipping: number) => {
      this.shippingPrice += shipping;
    });
  }

  showShoppingCartDrawer() {
    this.shareService.changeGotoCartPage(false);
  }

  getCart() {
    this.shareService.cartEmitted$.subscribe((cart) => {
      this.cart = cart;
      this.orderDetails = this.cart.cartItems.map(ci => {
        const orderDetail: OrderDetail = {
          productId: ci.productId,
          productName: ci.productName,
          price: ci.unitPrice,
          quantity: ci.quantity,
          colorId: ci.colorId,
          sizeId: ci.sizeId,
          colorName: ci.colorName,
          sizeName: ci.sizeName,
          imageUrl: ci.imageUrl
        };
        return orderDetail;
      });
    });
  }

  checkout(paymentId: number) {
    this.loaderService.showLoader('checkout');

    const orderInformation = this.informationComponent.getOrderInformation();
    const order: Order = {
      ...orderInformation,
      status: OrderStatus.Pending,
      totalPrice: this.orderDetails.map(x => x.price * x.quantity).reduce((a, b) => a + b) - this.discount,
      shippingCost: this.shippingPrice,
      discount: this.discount,
      paymentId: paymentId,
      orderDetails: [
        ...this.orderDetails
      ]
    };


    this.checkoutService.createOrder(order).pipe(
      finalize(() => this.loaderService.hideLoader('checkout'))
    ).subscribe(res => {
      if (res.isSuccess) {
        this.router.navigate(['/home']);
        this.messageService.success('Order successfully!');
        this.cart.cartItems = [];
        this.cart.totalPrice = 0;
        this.shareService.cartEmitEvent(this.cart);
      }
    });
  }
}
