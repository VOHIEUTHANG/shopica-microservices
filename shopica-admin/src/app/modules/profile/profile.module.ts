import { SlugifyPipe } from './../../core/pipe/slugify.pipe';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { SharedModule } from './../../shared/shared.module';
import { profileRoutes } from './profile.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateInfoComponent } from './page/update-info/update-info.component';
import { ChangePasswordComponent } from './page/change-password/change-password.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';

@NgModule({
  declarations: [UpdateInfoComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(profileRoutes),
    SharedModule,
    NzRadioModule,
    NzUploadModule,
    NzTimePickerModule,
  ],
  providers: [
    SlugifyPipe,
    DatePipe
  ]
})
export class ProfileModule { }
