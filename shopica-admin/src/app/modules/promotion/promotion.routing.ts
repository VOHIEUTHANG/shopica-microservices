import { PromotionListComponent } from './page/promotion-list/promotion-list.component';
import { Routes } from '@angular/router';
import { PromotionCardComponent } from './page/promotion-modal/promotion-card.component';
export const promotionRoute: Routes = [
  {
    path: '',
    component: PromotionListComponent
  },
  {
    path: 'add',
    data: {
      breadcrumb: 'Add'
    },
    component: PromotionCardComponent,
  },
  {
    path: 'detail/:promotionCode',
    data: {
      breadcrumb: 'Edit'
    },
    component: PromotionCardComponent,
  }
]
