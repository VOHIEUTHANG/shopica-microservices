
import { environment } from '@env';
import { StorageService } from '@core/services/storage/storage.service';
import { Component, OnInit } from '@angular/core';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { GhnService } from '@core/services/ghn/ghn.service';

@Component({
  selector: 'app-checkout-summary',
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.css']
})
export class CheckoutSummaryComponent implements OnInit {
  subtotal = 0;
  shippingPrice = 0;
  discount = 0;
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly ghnService: GhnService
  ) { }

  ngOnInit(): void {

    this.checkoutService.productPriceEmitted$.subscribe((price: number) => {
      this.subtotal += price;
    });

    this.checkoutService.shippingPriceEmitted$.subscribe((shipping: number) => {
      this.shippingPrice = shipping;
    });

    this.checkoutService.discountEmitted$.subscribe((discount: number) => {
      this.discount = discount;
    });
  }


}
