import { routes } from './../../app.routing';
import { ContactComponent } from './contact.component';
import { Routes } from '@angular/router';
export const contactRoutes: Routes = [
  {
    path: '',
    component: ContactComponent,
    data: {
      title: 'Contact'
    }
  }
];
