import { ProductCardModule } from './../product-card/product-card.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from './product-carousel.component';



@NgModule({
  declarations: [ProductCarouselComponent],
  imports: [
    CommonModule,
    CarouselModule,
    ProductCardModule
  ],
  exports: [
    ProductCarouselComponent
  ]
})
export class ProductCarouselModule { }
