import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { finalize } from 'rxjs/operators';
import { State } from '../../models/state';
import { CategoryReport } from '../../models/category';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

}

