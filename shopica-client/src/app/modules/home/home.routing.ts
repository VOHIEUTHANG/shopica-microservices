import { HomeComponent } from './page/home/home.component';
import { Routes } from '@angular/router';
export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  }
];
