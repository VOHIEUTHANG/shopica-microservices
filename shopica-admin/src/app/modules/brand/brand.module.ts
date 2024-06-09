import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandListComponent } from './page/brand-list/brand-list.component';
import { BrandModalComponent } from './page/brand-modal/brand-modal.component';
import { brandRoutes } from './brand.routing';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [BrandListComponent, BrandModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(brandRoutes)
  ]
})
export class BrandModule { }
