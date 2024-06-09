import { NzMessageModule } from 'ng-zorro-antd/message';
import { shareIcons } from './../../shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HeaderPageModule } from './../../shared/modules/header-page/header-page.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { contactRoutes } from './contact.routing';



@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderPageModule,
    NzInputModule,
    NzGridModule,
    NzFormModule,
    NzButtonModule,
    NzMessageModule,
    NzIconModule.forChild(shareIcons),

    RouterModule.forChild(contactRoutes)
  ]
})
export class ContactModule { }
