import { LoaderModule } from './../../shared/modules/loader/loader.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { shareIcons } from '@shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SectionTitleModule } from '@shared/modules/section-title/section-title.module';
import { ProductCarouselModule } from '@shared/modules/product-carousel/product-carousel.module';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { cartRoutes } from './cart.routing';
import { RouterModule } from '@angular/router';
import { CartItemModule } from '@shared/modules/cart-item/cart-item.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRowComponent } from './components/cart-row/cart-row.component';
import { CartComponent } from './page/cart/cart.component';


@NgModule({
  declarations: [
    CartRowComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule.forChild(shareIcons),

    RouterModule.forChild(cartRoutes),
    CartItemModule,
    ProductCarouselModule,
    SectionTitleModule,
    LoaderModule
  ],
  exports: [
    CartRowComponent,
  ]
})
export class CartModule { }
