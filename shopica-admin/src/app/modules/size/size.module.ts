import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeListComponent } from './page/size-list/size-list.component';
import { sizeRoutes } from './size.routing';
import { SizeModalComponent } from './page/size-modal/size-modal.component';


@NgModule({
  declarations: [SizeListComponent, SizeModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(sizeRoutes)
  ]
})
export class SizeModule { }
