import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@modules/dashboard/page/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { dashboardRoutes } from './dashboard.routing';
import { LineChartComponent } from './page/line-chart/line-chart.component';
import { BarChartComponent } from './page/bar-chart/bar-chart.component';
import { PieChartComponent } from './page/pie-chart/pie-chart.component';
import { RadarChartComponent } from './page/radar-chart/radar-chart.component';
import { CardComponent } from './page/card/card.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LineChartComponent,
    BarChartComponent,
    PieChartComponent,
    RadarChartComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    NgxChartsModule,
    RouterModule.forChild(dashboardRoutes),
    SharedModule,
    // ChartsModule
  ]
})
export class DashboardModule {
}
