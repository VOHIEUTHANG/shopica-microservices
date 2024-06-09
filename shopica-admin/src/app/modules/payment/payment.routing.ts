import { Routes } from '@angular/router';
import { PaymentMethodListComponent } from './page/payment-method-list/payment-method-list.component';
import { PaymentListComponent } from './page/payment-list/payment-list.component';

export const paymentRoutes: Routes = [
  {
    path: 'transaction',
    data: {
      breadcrumb: 'Transaction'
    },
    component: PaymentListComponent
  },
  {
    path: 'method',
    data: {
      breadcrumb: 'Method'
    },
    component: PaymentMethodListComponent,
  },
];
