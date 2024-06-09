import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogListComponent } from './page/blog-list/blog-list.component';
import { SharedModule } from '@shared/shared.module';
import { blogRoutes } from './blog.routing';
import { RouterModule } from '@angular/router';
import { BlogDetailComponent } from './page/blog-detail/blog-detail.component';
import { QuillModule } from 'ngx-quill';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';

@NgModule({
  declarations: [
    BlogListComponent,
    BlogDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzUploadModule,
    NzImageModule,
    QuillModule.forRoot(),
    RouterModule.forChild(blogRoutes)
  ]
})
export class BlogModule {

}
