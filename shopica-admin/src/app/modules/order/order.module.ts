import { SharedModule } from './../../shared/shared.module';
import { orderRoute } from './order.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './page/order-list/order-list.component';
import { OrderDetailComponent } from './page/order-detail/order-detail.component';



@NgModule({
  declarations: [OrderListComponent, OrderDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(orderRoute),
    SharedModule
  ]
})
export class OrderModule { }
