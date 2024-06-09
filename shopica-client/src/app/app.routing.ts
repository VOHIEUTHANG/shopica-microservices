import { Blog } from './core/model/blog/blog';
import { StorageService } from './core/services/storage/storage.service';
import { HomeComponent } from './modules/home/page/home/home.component';
import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./modules/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./modules/cart/cart.module').then(m => m.CartModule)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./modules/checkout/checkout.module').then(m => m.CheckoutModule)
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./modules/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./modules/blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
