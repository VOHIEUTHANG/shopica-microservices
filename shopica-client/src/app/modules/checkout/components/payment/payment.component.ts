import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CheckoutService } from './../../../../core/services/checkout/checkout.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { PaymentService } from '@core/services/payment/payment.service';
import { BaseParams } from '@core/model/base-params';
import { finalize } from 'rxjs';
import { PaymentMethod } from '@core/model/payment/payment-method';
import { Payment, PaymentStatus } from '@core/model/payment/payment';
import { JwtService } from '@core/services/jwt/jwt.service';
import { Order, OrderStatus } from '@core/model/order/order';
import { Cart } from '@core/model/cart/cart';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { OrderDetail } from '@core/model/order/order-details';
import { ShareService } from '@core/services/share/share.service';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@env';
import { Router } from '@angular/router';

declare var paypal;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @ViewChild('paypal', { static: true }) private paypal: ElementRef;
  @Output() createOrderEvent = new EventEmitter<number>();

  paymentMethodForm: UntypedFormGroup;
  listData: PaymentMethod[] = [];
  showPaypal = false;
  subtotal = 0;
  shippingPrice = 0;
  discount = 0;
  transactionId = '';
  paymentId: number;
  cart: Cart;

  constructor(
    private readonly shareService: ShareService,
    private readonly storageService: StorageService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly checkoutService: CheckoutService,
    private readonly paymentService: PaymentService,
    private readonly messageService: NzMessageService,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) { }


  buildForm() {
    this.paymentMethodForm = this.formBuilder.group({
      method: ['CASH', Validators.required]
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.paymentMethodForm.valueChanges.subscribe(value => {
      value.method === 'PAYPAL' ? this.showPaypal = true : this.showPaypal = false;
    });

    this.initPayment();

    this.checkoutService.productPriceEmitted$.subscribe((price: number) => {
      this.subtotal += price;
    });

    this.checkoutService.shippingPriceEmitted$.subscribe((shipping: number) => {
      this.shippingPrice += shipping;
    });

    this.checkoutService.discountEmitted$.subscribe((discount: number) => {
      this.discount += discount;
    });

    this.paymentService.getAll(new BaseParams(1, 5)).pipe(
    ).subscribe(response => {
      if (response.isSuccess) {
        this.listData = response.data.data;
      }
    });

    // this.loaderService.showLoader('checkout');
    // this.getCart();
  }


  initPayment() {
    paypal
      .Buttons(
        {
          style: {
            size: 'small',
            height: 30,
            layout: 'vertical',
            label: 'pay'
          },
          funding: {
            allowed: [paypal.FUNDING.CARD],
            disallowed: [paypal.FUNDING.CREDIT]
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.subtotal + this.shippingPrice - this.discount,
                    currency_code: 'USD'
                  }
                }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(_details => {
              if (_details.status === 'COMPLETED') {
                this.transactionId = _details.purchase_units[0].payments.captures[0].id;
                this.PaymentWithPaypal(this.transactionId);
              }
            });
          },
          onError: error => {
            this.messageService.error(error);
          }

        }).render(this.paypal.nativeElement);
  }

  PaymentWithPaypal(transactionId: string) {
    const payment: Payment = {
      amount: this.subtotal + this.shippingPrice - this.discount,
      customerId: this.jwtService.getUserId(),
      paymentDate: new Date(),
      paymentMethodId: 2,
      paymentStatus: PaymentStatus.Processed,
      transactions: [
        {
          description: 'Pay with Paypal',
          externalTransactionId: transactionId,
          transactionDate: new Date(),
        }
      ]
    }

    this.paymentService.createPayment(payment).subscribe(
      res => {
        if (res.isSuccess) {
          this.paymentId = res.data.id;
          this.createOrderEvent.emit(this.paymentId);
        }
      }
    )
  }

  payByCash() {
    const payment: Payment = {
      amount: this.subtotal + this.shippingPrice - this.discount,
      customerId: this.jwtService.getUserId(),
      paymentDate: new Date(),
      paymentMethodId: 3,
      paymentStatus: PaymentStatus.Processed,
      transactions: [
        {
          description: 'Pay by cash',
          transactionDate: new Date(),
        }
      ]
    }

    this.paymentService.createPayment(payment).subscribe(
      res => {
        if (res.isSuccess) {
          this.paymentId = res.data.id;
          this.createOrderEvent.emit(this.paymentId);
        }
      }
    )
  }

}
