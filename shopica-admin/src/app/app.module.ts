import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';


import { AppComponent } from './app.component';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';

import { routes } from '@app/app.routing';
import { NZ_DATE_LOCALE, NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from './core/jwt/jwt-options-factory';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { UtilitiesService } from './core/services/utilities/utilities.service';

const ngZorroConfig: NzConfig = {
  message: {
    nzDuration: 3000
  }
};

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    NzButtonModule,
    NzLayoutModule,
    RouterModule.forRoot(routes),
    // jwt
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [UtilitiesService]
      }
    })
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
