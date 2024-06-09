import { BlogDetailComponent } from './page/blog-detail/blog-detail.component';
import { Routes } from '@angular/router';
import { BlogListComponent } from './page/blog-list/blog-list.component';
export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    data: {
      title: 'Blogs'
    },
  },
  {
    path: 'detail/:blogId',
    component: BlogDetailComponent,
    data: {
      title: 'Blog Detail'
    },
  }

];
