import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderListComponent } from './page/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailComponent } from './page/purchase-order-detail/purchase-order-detail.component';
import { RouterModule } from '@angular/router';
import { purchaseOrderRoute } from './inventory.routing';
import { SharedModule } from '@app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { WarehouseEntryListComponent } from './page/warehouse-entry-list/warehouse-entry-list.component';


@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    PurchaseOrderDetailComponent,
    WarehouseEntryListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(purchaseOrderRoute),
    SharedModule,
    NzDatePickerModule
  ]
})
export class PurchaseOrderModule { }
