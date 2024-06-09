import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from '@app/modules/category/services/category.service';
import { BaseParams } from '@app/modules/common/base-params';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ChartData } from '../../models/chart-data';
import { DashboardService } from '../../services/dashboard-service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Category';
  showYAxisLabel = true;
  yAxisLabel = 'Revenue';

  colorScheme: Color = {
    name: "",
    group: ScaleType.Linear,
    selectable: true,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#a7385c', '#ffd54f', '#3f51b5', '#1e89de', '#00b862', '#afdf0a', '#e99450', '#ffecb3']
  };

  data: ChartData[] = [];

  constructor(private readonly categoryService: CategoryService,
    private readonly dashboardService: DashboardService
  ) {
    Object.assign(this, { single })
  }
  ngOnInit(): void {
    combineLatest([
      this.dashboardService.getProductByCategory(),
      this.dashboardService.getProductRevenues()
    ]).subscribe(res => {
      if (res[0].isSuccess && res[1].isSuccess) {
        res[0].data.forEach(c => {
          this.data =
            [
              ...this.data,
              {
                name: c.categoryName,
                value: res[1].data.filter(x => c.productIds.indexOf(x.productId) !== -1).reduce((a, b) => a + b.revenues, 0)
              }
            ]
        });
      }
    });
  }

  onSelect(event: any) {
  }
}


export var single = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  }
];

export var multi = [
  {
    "name": "Germany",
    "series": [
      {
        "name": "2010",
        "value": 7300000
      },
      {
        "name": "2011",
        "value": 8940000
      }
    ]
  },

  {
    "name": "USA",
    "series": [
      {
        "name": "2010",
        "value": 7870000
      },
      {
        "name": "2011",
        "value": 8270000
      }
    ]
  },

  {
    "name": "France",
    "series": [
      {
        "name": "2010",
        "value": 5000002
      },
      {
        "name": "2011",
        "value": 5800000
      }
    ]
  }
]
