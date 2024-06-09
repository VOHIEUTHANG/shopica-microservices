import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './page/category-list/category-list.component';
import { CategoryModalComponent } from './page/category-modal/category-modal.component';
import { categoryRoutes } from './category.routing';
import { NzUploadModule } from 'ng-zorro-antd/upload';



@NgModule({
  declarations: [CategoryListComponent, CategoryModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzUploadModule,
    RouterModule.forChild(categoryRoutes)
  ]
})
export class CategoryModule { }
