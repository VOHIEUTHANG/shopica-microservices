import { SharedModule } from './../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PromotionListComponent } from './page/promotion-list/promotion-list.component';
import { PromotionCardComponent } from './page/promotion-modal/promotion-card.component';
import { promotionRoute } from './promotion.routing';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [
    PromotionListComponent,
    PromotionCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(promotionRoute),
    SharedModule,
    NzDatePickerModule,
    NzSelectModule,
    NzCheckboxModule,
  ],
  providers: [DatePipe]
})
export class PromotionModule { }
