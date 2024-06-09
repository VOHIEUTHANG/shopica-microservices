import { productRoutes } from './../../../modules/product/product.routing';
import { RouterModule } from '@angular/router';
import { CartItemModule } from './../cart-item/cart-item.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { shareIcons } from './../../share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card.component';

@NgModule({
  declarations: [ProductCardComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzToolTipModule,
    CartItemModule,
    RouterModule
  ],
  exports: [ProductCardComponent]
})
export class ProductCardModule { }
