import { LoaderModule } from './shared/modules/loader/loader.module';
import { BlogCardModule } from './shared/modules/blog-card/blog-card.module';
import { CartItemModule } from './shared/modules/cart-item/cart-item.module';
import { JwtService } from './core/services/jwt/jwt.service';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';
import { ScrollToTopComponent } from './layout/scroll-to-top/scroll-to-top.component';
import { MenuDrawerComponent } from './layout/drawers/menu-drawer/menu-drawer.component';
import { LoginDrawerComponent } from './layout/drawers/login-drawer/login-drawer.component';
import { CoreModule } from './core/core.module';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from './core/interceptor/jwt-options-factory';
import { RegisterDrawerComponent } from './layout/drawers/register-drawer/register-drawer.component';
import { ResetPasswordDrawerComponent } from './layout/drawers/reset-password-drawer/reset-password-drawer.component';
import { ShoppingCartDrawerComponent } from './layout/drawers/shopping-cart-drawer/shopping-cart-drawer.component';
import { QuickViewComponent } from './layout/modals/quick-view/quick-view.component';
import { QuickShopComponent } from './layout/modals/quick-shop/quick-shop.component';
import { SearchDrawerComponent } from './layout/drawers/search-drawer/search-drawer.component';
import { SearchModalComponent } from './layout/modals/search-modal/search-modal.component';
import { environment } from '@env';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ScrollToTopComponent,
    MenuDrawerComponent,
    LoginDrawerComponent,
    RegisterDrawerComponent,
    ResetPasswordDrawerComponent,
    ShoppingCartDrawerComponent,
    QuickViewComponent,
    QuickShopComponent,
    SearchDrawerComponent,
    SearchModalComponent,
    LoginDrawerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoaderModule,
    CartItemModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzNotificationModule,
    RouterModule.forRoot(routes,
      { scrollPositionRestoration: 'top' }
    ),
    // jwt
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [JwtService]
      }
    }),
    SocialLoginModule,
    GoogleSigninButtonModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.social.google.clientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.social.facebook.clientID)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
