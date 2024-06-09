import { FormsModule } from '@angular/forms';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SectionTitleModule } from './../../shared/modules/section-title/section-title.module';
import { SectionTitleComponent } from './../../shared/modules/section-title/section-title.component';
import { shareIcons } from './../../shared/share-icon';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { HeaderPageModule } from './../../shared/modules/header-page/header-page.module';
import { aboutRoutes } from './about.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AboutComponent } from './about.component';


@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    HeaderPageModule,

    CarouselModule,
    NzToolTipModule,
    NzGridModule,
    NzRateModule,
    FormsModule,
    NzIconModule.forChild(shareIcons),
    RouterModule.forChild(aboutRoutes)
  ]
})
export class AboutModule { }
