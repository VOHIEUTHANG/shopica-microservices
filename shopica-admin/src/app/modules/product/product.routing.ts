import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { ProductListComponent } from './page/product-list/product-list.component';
import { Routes } from '@angular/router';
export const productRoutes: Routes = [
  {
    path: '',
    component: ProductListComponent,
  },
  {
    path: 'add',
    data: {
      breadcrumb: 'Add'
    },
    component: ProductDetailComponent,
  },
  {
    path: 'detail/:productId',
    data: {
      breadcrumb: 'Edit'
    },
    component: ProductDetailComponent,
  }
]
