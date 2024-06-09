import { AuthGuard } from '@core/guards/auth.guard';
import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { DashboardComponent } from './../dashboard/page/dashboard/dashboard.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        // component: DashboardComponent,
        data: {
          breadcrumb: 'Home'
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'size',
        data: {
          breadcrumb: 'Size'
        },
        loadChildren: () =>
          import('../size/size.module').then((m) => m.SizeModule),
      },
      {
        path: 'category',
        data: {
          breadcrumb: 'Category'
        },
        loadChildren: () =>
          import('../category/category.module').then((m) => m.CategoryModule),
      },
      {
        path: 'color',
        data: {
          breadcrumb: 'Color'
        },
        loadChildren: () =>
          import('../color/color.module').then((m) => m.ColorModule),
      },
      {
        path: 'brand',
        data: {
          breadcrumb: 'Brand'
        },
        loadChildren: () =>
          import('../brand/brand.module').then((m) => m.BrandModule),
      },
      {
        path: 'promotion',
        data: {
          breadcrumb: 'Promotion'
        },
        loadChildren: () =>
          import('../promotion/promotion.module').then(
            (m) => m.PromotionModule
          ),
      },
      {
        path: 'product',
        data: {
          breadcrumb: 'Product'
        },
        loadChildren: () =>
          import('../product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'profile',
        data: {
          breadcrumb: 'Profile'
        },
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'order',
        data: {
          breadcrumb: 'Order'
        },
        loadChildren: () =>
          import('../order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'blog',
        data: {
          breadcrumb: 'Blog'
        },
        loadChildren: () =>
          import('../blog/blog.module').then((m) => m.BlogModule),
      },
      {
        path: 'payment',
        data: {
          breadcrumb: 'Payment'
        },
        loadChildren: () =>
          import('../payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'inventory',
        data: {
          breadcrumb: 'Inventory'
        },
        loadChildren: () =>
          import('../inventory/inventory.module').then((m) => m.PurchaseOrderModule),
      },
    ],
  },
];
