import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../layout/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgZorroAntdModule } from './ng-zorro-antd.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CarouselModule,
    NgZorroAntdModule
  ],
  exports: [
    NgZorroAntdModule,
    CarouselModule,
  ]
})
export class SharedModule { }
