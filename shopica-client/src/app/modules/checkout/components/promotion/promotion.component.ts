import { OrderStatus } from '../../../../core/model/order/order';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ProductGroupComponent } from '../product-group/product-group.component';
import { PaymentComponent } from '../payment/payment.component';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { LoaderService } from '../../../../shared/modules/loader/loader.service';
import { ShippingAddress } from '../../../../core/model/address/shipping-address';
import { ShareService } from '@core/services/share/share.service';

import { Cart } from '../../../../core/model/cart/cart';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren, QueryList, SimpleChanges, Input } from '@angular/core';
import { environment } from '@env';
import { Order } from '@core/model/order/order';
import { OrderDetail } from '@core/model/order/order-details';
import { JwtService } from '@core/services/jwt/jwt.service';
import { PromotionResponse, PromotionType } from '@core/model/promotion/promotion-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionRequest } from '@core/model/promotion/promotion-request';
import { BaseParams } from '@core/model/base-params';
import { CartItem } from '@core/model/cart/cart-item';
import { CartService } from '@core/services/cart/cart.service';
import { PromotionService } from '@core/services/promotion/promotion.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  @Input() cart: Cart;
  couponForm: FormGroup;
  shippingFee: number;
  promotionData: PromotionResponse[];
  appliedPromotion: PromotionResponse;

  constructor(
    private readonly promotionService: PromotionService,
    private readonly checkoutService: CheckoutService,
    private readonly formBuilder: FormBuilder,
    private readonly jwtService: JwtService,
    private readonly loaderService: LoaderService,
    private readonly shareService: ShareService

  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.couponForm = this.formBuilder.group({
      couponCode: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cart !== undefined && changes.cart.currentValue !== undefined) {
      this.promotionService.getValidPromotions(new BaseParams(1, 5), this.getPromotionRequest('')).subscribe(res => {
        if (res.isSuccess) {
          this.promotionData = res.data.data;
          if (this.cart.promotionResults.length > 0) {
            const index = this.promotionData.findIndex(p => p.code == this.cart.promotionResults[0].promotionCode);
            if (index !== -1) {
              this.appliedPromotion = this.promotionData[index];
              this.couponForm.controls['couponCode'].setValue(this.appliedPromotion.code);
            }
          }
        }
      });

      this.checkoutService.productPriceChange(this.getTotalPrice());

      this.checkoutService.discountChange(this.getDiscountAmount());
    }
  }


  private getTotalPrice() {
    if (this.cart.cartItems?.length == 0) {
      return 0;
    }

    return this.cart.cartItems?.map(x => x.unitPrice * x.quantity).reduce((a, b) => a + b);
  }

  private getDiscountAmount() {
    if (this.cart.promotionResults?.length == 0) {
      return 0;
    }
    return this.cart.promotionResults?.map(x => {
      switch (x.promotionType) {
        case PromotionType.Product:
          return x.promotionPrice * x.promotionQuantity
        case PromotionType.Amount:
          return x.promotionAmount;
        case PromotionType.Discount:
          const discount = x.promotionDiscount * this.getTotalPrice() / 100;
          return discount > x.promotionDiscountLimit ? x.promotionDiscountLimit : discount;
      }
    }).reduce((a, b) => a + b);
  }


  applyCouponFromPromotionList(promotionCode: string) {
    this.couponForm.controls['couponCode'].setValue(promotionCode);
    this.applyCoupon();
  }

  applyCoupon() {

    this.loaderService.showLoader('checkout');

    const promotionCode = this.couponForm.controls['couponCode']?.value;

    if (this.appliedPromotion?.code === promotionCode) {
      return;
    }

    this.clearFormError();

    this.promotionService.applyPromotion(this.getPromotionRequest(promotionCode))
      .pipe(
        finalize(() => this.loaderService.hideLoader('checkout'))
      ).subscribe(res => {
        if (res.isSuccess) {
          this.applyPromotion(res.data);
          this.appliedPromotion = res.data;
        }
        else {
          this.couponForm.controls.couponCode.setErrors({ error: res.errorMessage });
        }
      })
  }

  removeCurrentPromotion() {
    this.loaderService.showLoader('checkout');

    this.promotionService.removePromotion(this.cart.customerId, this.appliedPromotion.code)
      .pipe(
        finalize(() => this.loaderService.hideLoader('checkout'))
      )
      .subscribe(res => {
        if (res.isSuccess) {
          this.appliedPromotion = null;
          this.couponForm.reset();
          this.clearFormError();
          this.checkoutService.discountChange(0);
          this.cart.cartItems.filter(ci => ci.isPromotionLine).forEach(ci => {
            this.shareService.deleteCartItemEvent(ci);
          });
        }
      })
  }

  getPromotionRequest(promotionCode: string): PromotionRequest {
    return {
      customerId: this.cart.customerId,
      totalPrice: this.getTotalPrice(),
      orderDate: new Date(),
      promotionCode: promotionCode,
      promotionDetails: this.cart.cartItems.map(ci => {
        return {
          productId: ci.productId,
          productName: ci.productName,
          unitPrice: ci.unitPrice,
          quantity: ci.quantity,
          sizeId: ci.sizeId,
          sizeName: ci.sizeName,
          colorId: ci.colorId,
          colorName: ci.colorName
        }
      })
    }
  }

  clearFormError() {
    for (const i in this.couponForm.controls) {
      this.couponForm.controls[i].markAsDirty();
      this.couponForm.controls[i].updateValueAndValidity();
    }
  }


  applyPromotion(promotionData: PromotionResponse) {
    this.cart.cartItems = [
      ...this.cart.cartItems.filter(ci => !ci.isPromotionLine)
    ];

    switch (promotionData.type) {
      case PromotionType.Amount:
        this.checkoutService.discountChange(promotionData.promotionAmount);
        break;
      case PromotionType.Discount:
        const discount = promotionData.promotionDiscount * this.getTotalPrice() / 100;
        this.checkoutService.discountChange(discount > promotionData.promotionDiscountLimit ? promotionData.promotionDiscountLimit : discount);
        break;
      case PromotionType.Product:

        this.cart.cartItems = [
          ...this.cart.cartItems,
          {
            productId: promotionData.promotionById,
            productName: promotionData.promotionByName,
            quantity: promotionData.promotionQuantity,
            unitPrice: promotionData.promotionPrice,
            colorId: promotionData.promotionColorId,
            colorName: promotionData.promotionColorName,
            sizeId: promotionData.promotionSizeId,
            sizeName: promotionData.promotionSizeName,
            imageUrl: promotionData.promotionImageUrl,
            isPromotionLine: true,
            promotionCode: promotionData.code
          }
        ]
        this.checkoutService.discountChange(promotionData.promotionPrice * promotionData.promotionQuantity);
        break;
    }

    this.shareService.cartEmitEvent(this.cart);
  }
}
