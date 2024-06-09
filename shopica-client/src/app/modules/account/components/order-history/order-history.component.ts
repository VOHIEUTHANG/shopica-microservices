import { finalize } from 'rxjs/operators';
import { CheckoutService } from './../../../../core/services/checkout/checkout.service';
import { JwtService } from './../../../../core/services/jwt/jwt.service';
import { Component, OnInit } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { Order, OrderStatus } from '@core/model/order/order';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[];
  public orderStatus = OrderStatus;
  isLoading = false;
  constructor(
    private readonly jwtService: JwtService,
    private readonly checkoutService: CheckoutService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.checkoutService.getOrderByCustomerId(new BaseParams(1, 50), this.jwtService.getUserId()).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        this.orders = res.data.data;
      }
    });
  }

}
