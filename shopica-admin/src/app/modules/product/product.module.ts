import { SharedModule } from './../../shared/shared.module';
import { productRoutes } from './product.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './page/product-list/product-list.component';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ProductImageComponent } from './page/product-image/product-image.component';


@NgModule({
  declarations: [ProductListComponent, ProductDetailComponent, ProductImageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes),
    SharedModule,
    NzSelectModule,
    NzUploadModule,
  ]
})
export class ProductModule { }
