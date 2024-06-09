import { RouterModule } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { shareIcons } from './../../share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CartItemComponent } from './cart-item.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectColorComponent } from './components/select-color/select-color.component';
import { SelectSizeComponent } from './components/select-size/select-size.component';
import { InputQuantityComponent } from './components/input-quantity/input-quantity.component';



@NgModule({
  declarations: [
    CartItemComponent,
    SelectColorComponent,
    SelectSizeComponent,
    InputQuantityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzInputModule,
    NzToolTipModule,
    NzIconModule.forChild(shareIcons),
  ],
  exports: [
    CartItemComponent,
    SelectColorComponent,
    SelectSizeComponent,
    InputQuantityComponent
  ]
})
export class CartItemModule { }
