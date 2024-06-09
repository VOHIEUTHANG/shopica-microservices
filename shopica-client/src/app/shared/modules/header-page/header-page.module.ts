import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from './header-page.component';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    HeaderPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    HeaderPageComponent
  ]
})
export class HeaderPageModule { }
