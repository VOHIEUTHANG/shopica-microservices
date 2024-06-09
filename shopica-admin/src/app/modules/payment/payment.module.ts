import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { RouterModule } from '@angular/router';
import { paymentRoutes } from './payment.routing';
import { PaymentMethodListComponent } from './page/payment-method-list/payment-method-list.component';
import { PaymentMethodModalComponent } from './page/payment-method-modal/payment-method-modal.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { PaymentListComponent } from './page/payment-list/payment-list.component';
import { PaymentModalComponent } from './page/payment-modal/payment-modal.component';



@NgModule({
  declarations: [
    PaymentMethodListComponent,
    PaymentMethodModalComponent,
    PaymentListComponent,
    PaymentModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    NzUploadModule,
    NzCheckboxModule,
    RouterModule.forChild(paymentRoutes)
  ]
})
export class PaymentModule { }
