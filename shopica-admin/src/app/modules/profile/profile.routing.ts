import { ChangePasswordComponent } from './page/change-password/change-password.component';
import { Routes } from '@angular/router';
import { UpdateInfoComponent } from './page/update-info/update-info.component';
export const profileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user-info',
        component: UpdateInfoComponent
      }
    ]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },

]
