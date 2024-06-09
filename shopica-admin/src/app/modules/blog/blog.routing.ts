import { Routes } from '@angular/router';
import { BlogDetailComponent } from './page/blog-detail/blog-detail.component';
import { BlogListComponent } from './page/blog-list/blog-list.component';

export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogListComponent,
  },
  {
    path: 'detail/:blogId',
    data: {
      breadcrumb: 'Edit'
    },
    component: BlogDetailComponent,
  },
  {
    path: 'add',
    data: {
      breadcrumb: 'Add'
    },
    component: BlogDetailComponent,
  },
];
