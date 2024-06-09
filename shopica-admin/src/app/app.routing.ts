import { AuthGuard } from '@core/guards/auth.guard';
import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
export const routes: Routes = [
  {
    path: 'admin',
    data: {
      breadcrumb: 'Home'
    },
    loadChildren: () =>
      import('./modules/main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/admin',
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];
