import { finalize, switchMap } from 'rxjs/operators';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order, OrderStatus } from '../../model/order';
import { Address } from '@app/modules/profile/model/address';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderId: number;
  order: Order;
  public orderStatus = OrderStatus;
  orderDetails = [];
  isLoading = false;
  isHaveOrder = true;
  constructor(
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(params => {
        if (params.orderId) {
          this.isLoading = true;
          this.orderId = params.orderId;
          return this.orderService.getOrderDetails(this.orderId);
        }
      })
    ).subscribe(res => {
      if (res.isSuccess) {
        this.order = res.data;
        this.orderDetails = this.order.orderDetails;
      }
      else {
        this.isHaveOrder = false;
      }
      this.isLoading = false
    })
  }


  updateStatus(newStatus: OrderStatus) {
    const order = this.order;
    order.status = newStatus;
    this.orderService.updateStatus(order).subscribe(res => {
      if (res.isSuccess) {
        this.order = res.data;
        this.messageService.success("update status successfully");
      }
    })
  }

}
