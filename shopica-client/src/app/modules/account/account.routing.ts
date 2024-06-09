import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthGuard } from './../../core/guards/auth.guard';
import { LoginComponent } from './page/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountComponent } from './page/account/account.component';
import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './page/reset-password/reset-password.component';
export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Account'
        },
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password'
        },
      },
      {
        path: 'order-history',
        component: OrderHistoryComponent,
        data: {
          title: 'Change Password'
        },
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent,
        data: {
          title: 'Order Detail'
        },
      }
    ]
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password'
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  }
];
