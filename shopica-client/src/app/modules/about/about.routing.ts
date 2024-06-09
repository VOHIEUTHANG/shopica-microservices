import { AboutComponent } from './about.component';
import { Routes } from '@angular/router';
export const aboutRoutes: Routes = [
  {
    path: '',
    component: AboutComponent,
    data: {
      title: 'About'
    },
  }
];
