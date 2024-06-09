import { Component, Input, OnInit } from '@angular/core';
import { Category } from '@app/modules/category/models/category';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  @Input() chartTitle: string;
  @Input() sales: number[];
  // lineChartData: ChartDataSets[];
  constructor() { }

  ngOnInit(): void {
    // this.lineChartData = [{ data: this.sales, label: 'Sales' }];
  }

  // lineChartLabels: Label[] = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];
  // lineChartOptions: ChartOptions & { annotation: any } = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     // We use this empty structure as a placeholder for dynamic theming.
  //     xAxes: [{}],
  //     yAxes: [
  //       {
  //         id: 'y-axis-0',
  //         position: 'left',
  //       },
  //     ],
  //   },
  //   annotation: {
  //     annotations: [
  //       {
  //         type: 'line',
  //         mode: 'vertical',
  //         scaleID: 'x-axis-0',
  //         value: 'March',
  //         borderColor: 'orange',
  //         borderWidth: 1,
  //         label: {
  //           enabled: true,
  //           fontColor: 'orange',
  //           content: 'LineAnno',
  //         },
  //       },
  //     ],
  //   },
  // };

  // lineChartColors: Color[] = [
  //   {
  //     // grey
  //     backgroundColor: 'rgba(0, 255, 0, 0.13)',
  //     borderColor: 'rgba(0, 197, 0, 0.81)',
  //     pointBackgroundColor: 'rgba(0, 197, 0, 0.81)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(0, 197, 0, 0.81)',
  //   },
  // ];

  // lineChartLegend = true;
  // lineChartType: ChartType = 'line';

  // // events
  // chartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
  //   console.log(event, active);
  // }

  // chartHovered({ event, active }: { event: MouseEvent; active: {}[] }): void {
  //   console.log(event, active);
  // }
}
