import { Routes } from '@angular/router';
import { LoginComponent } from '@modules/auth/page/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];
