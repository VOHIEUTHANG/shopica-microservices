import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '@app/modules/order/services/order.service';
import { DashboardService } from '../../services/dashboard-service';
import { ChartData } from '../../models/chart-data';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() category: string;
  @Input() number: number;
  @Input() time: string;
  @Input() iconStyle: { [key: string]: any };
  @Input() iconName: string;
  single: any[];
  data: ChartData[] = [];

  constructor(private readonly dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.dashboardService.getTotalOrders().subscribe(res => {
      if (res.isSuccess) {
        this.data = [...this.data, { name: 'Sales', value: res.data }]
      }
    })

    this.dashboardService.getTotalRevenues().subscribe(res => {
      if (res.isSuccess) {
        this.data = [...this.data, { name: 'Revenues', value: res.data }]
      }
    })

    this.dashboardService.getTotalUsers().subscribe(res => {
      if (res.isSuccess) {
        this.data = [...this.data, { name: 'Customers', value: res.data }]
      }
    })

    this.dashboardService.getTotalProducts().subscribe(res => {
      if (res.isSuccess) {
        this.data = [...this.data, { name: 'Products', value: res.data }]
      }
    })

  }


  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  cardColor: string = '#f0f2f5';

  onSelect(event) {
  }
}
