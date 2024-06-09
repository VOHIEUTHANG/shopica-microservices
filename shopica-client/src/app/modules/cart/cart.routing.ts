import { CartComponent } from './page/cart/cart.component';
import { Routes } from '@angular/router';
export const cartRoutes: Routes = [
  {
    path: '',
    component: CartComponent,
    data: {
      title: 'Cart'
    }
  }
];
