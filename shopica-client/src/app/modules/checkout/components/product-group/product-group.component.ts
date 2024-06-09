import { OrderDetail } from './../../../../core/model/order/order-details';
import { PromotionRequest } from './../../../../core/model/promotion/promotion-request';
import { finalize } from 'rxjs/operators';

import { LoaderService } from '@shared/modules/loader/loader.service';
import { FormControl, UntypedFormGroup, UntypedFormBuilder, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from '@core/services/storage/storage.service';
import { ShareService } from '@core/services/share/share.service';
import { GhnService } from '@core/services/ghn/ghn.service';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { environment } from '@env';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { Promotion } from '@core/model/promotion/promotion';
import { CartItem } from '@core/model/cart/cart-item';
import { Cart } from '@core/model/cart/cart';
import { PromotionResponse, PromotionType } from '@core/model/promotion/promotion-response';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.css']
})
export class ProductGroupComponent implements OnInit {

  visible = false;
  shippingAddress: ShippingAddress;
  @Input() cart: Cart;
  constructor(
    private readonly ghnService: GhnService,
    private readonly storageService: StorageService,
    private readonly loaderService: LoaderService,
    private readonly checkoutService: CheckoutService
  ) { }

  ngOnInit(): void {
  }

}
