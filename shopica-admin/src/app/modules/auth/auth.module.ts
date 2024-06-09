import { SlugifyPipe } from './../../core/pipe/slugify.pipe';
import { routes } from './auth.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzIconModule } from 'ng-zorro-antd/icon'

import { LoginComponent } from '@modules/auth/page/login/login.component';

import { icons } from './auth-icon';
import { NzMessageModule } from 'ng-zorro-antd/message';
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzGridModule,
    NzStepsModule,
    NzTimePickerModule,
    NzMessageModule,
    NzIconModule.forChild(icons)
  ],
  providers: [
    DatePipe,
    SlugifyPipe
  ]
})
export class AuthModule { }
