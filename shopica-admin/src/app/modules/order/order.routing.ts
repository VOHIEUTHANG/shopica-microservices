import { OrderDetailComponent } from './page/order-detail/order-detail.component';
import { OrderListComponent } from './page/order-list/order-list.component';
import { Routes } from '@angular/router';
export const orderRoute: Routes = [
  {
    path: "",
    component: OrderListComponent
  },
  {
    path: 'detail/:orderId',
    data: {
      breadcrumb: 'Detail'
    },
    component: OrderDetailComponent
  }
]
