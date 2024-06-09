import { Component, Input, OnInit } from '@angular/core';
import { State } from '../../models/state';
import { DashboardService } from '../../services/dashboard-service';
import { ChartData } from '../../models/chart-data';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  showLabels: boolean = true;

  data: ChartData[] = [];
  colorScheme = {
    domain: ['#ebe7e7', '#1c1b1b', '#6588f4', '#939393', '#5AA454', '#fff63d']
  };

  onSelect(event) {
  }

  constructor(private readonly dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getProductByColor().subscribe(res => {
      if (res.isSuccess) {
        this.data = res.data.map(c => {
          const data: ChartData = {
            name: c.colorName,
            value: c.productCount
          }
          return data;
        })
      }
    })
  }

}
