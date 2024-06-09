import { WishListComponent } from './page/wish-list/wish-list.component';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { ProductComponent } from './page/product/product.component';
import { Routes } from '@angular/router';
export const productRoutes: Routes = [
  {
    path: 'collection/:category',
    component: ProductComponent,
    data: {
      title: 'Product'
    }
  },
  {
    path: 'detail/:productId',
    component: ProductDetailComponent,
    data: {
      title: 'Product Detail'
    }
  },
  {
    path: 'wishlist',
    component: WishListComponent,
    data: {
      title: 'Wishlist'
    }
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'collection/all',
  },
];
