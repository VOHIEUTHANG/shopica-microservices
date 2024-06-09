import { Component, OnInit, Input } from '@angular/core';
import { Category } from '@app/modules/category/models/category';
import { CategoryReport } from '../../models/category';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css'],
})
export class RadarChartComponent implements OnInit {
  @Input() chartTitle;
  @Input() category: CategoryReport[];
  // radarChartOptions: RadialChartOptions = {
  //   maintainAspectRatio: false,
  // };
  // radarChartLabels: Label[] = [];

  // radarChartData: ChartDataSets[] = [];
  // radarChartType: ChartType = 'radar';

  constructor() { }

  ngOnInit(): void {
    // let data: number[] = [];
    // this.category.forEach((it) => {
    //   this.radarChartLabels.push(it.categoryName);
    //   data.push(it.quantity);
    // });
    // this.radarChartData.push({ data: data, label: 'Product' });
  }
}
