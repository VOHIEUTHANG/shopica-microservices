import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LoaderModule } from './../../shared/modules/loader/loader.module';
import { CartModule } from './../cart/cart.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { shareIcons } from './../../shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PaymentComponent } from './components/payment/payment.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { InformationComponent } from './components/information/information.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CartItemModule } from './../../shared/modules/cart-item/cart-item.module';
import { checkoutRoutes } from './checkout.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { ProductGroupComponent } from './components/product-group/product-group.component';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AddressListModalComponent } from './components/address-list-modal/address-list-modal.component';
import { AddAddressModalComponent } from './components/add-address-modal/add-address-modal.component';
@NgModule({
  declarations: [
    InformationComponent,
    PromotionComponent,
    PaymentComponent,
    CheckoutComponent,
    ProductGroupComponent,
    CheckoutSummaryComponent,
    AddressListModalComponent,
    AddAddressModalComponent
  ],
  imports: [
    CommonModule,
    CartItemModule,
    ReactiveFormsModule,
    CartModule,
    LoaderModule,

    NzInputModule,
    NzGridModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzStepsModule,
    NzCollapseModule,
    NzRadioModule,
    NzMessageModule,
    NzCheckboxModule,
    NzModalModule,
    NzPopconfirmModule,

    NzIconModule.forChild(shareIcons),
    RouterModule.forChild(checkoutRoutes)
  ],
})
export class CheckoutModule { }
