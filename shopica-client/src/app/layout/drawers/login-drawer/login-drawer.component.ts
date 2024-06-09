import { ModalService } from './../../../core/services/modal/modal.service';
import { ProductService } from '@core/services/product/product.service';
import { Product } from './../../../core/model/product/product';
import { CartService } from './../../../core/services/cart/cart.service';

import { ShareService } from './../../../core/services/share/share.service';
import { LoginMethod } from './../../../core/enum/login-method';
import { StorageService } from './../../../core/services/storage/storage.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env';
import { JwtService } from '@core/services/jwt/jwt.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { BaseParams } from '@core/model/base-params';
import { SocialLogin } from '@core/model/user/social-login';

@Component({
  selector: 'app-login-drawer',
  templateUrl: './login-drawer.component.html',
  styleUrls: ['./login-drawer.component.css']
})

export class LoginDrawerComponent implements OnInit {
  @Output() openRegisterDrawerEvent = new EventEmitter<boolean>();
  @Output() openResetPasswordDrawerEvent = new EventEmitter<boolean>();
  isVisible = false;
  isClose: Observable<any>;
  loginForm: UntypedFormGroup;
  isLoading = false;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly storageService: StorageService,
    private readonly shareService: ShareService,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly modalService: ModalService,
    private readonly jwtService: JwtService,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.modalService.openLoginDrawerEmitted$.subscribe(() => {
      this.isVisible = true;
    });

    this.modalService.closeLoginDrawerEmitted$.subscribe(data => {
      this.isVisible = false;
    });


    if (this.authService.isAuthenticated()) {
      this.getCustomerDetail();
    }

    this.socialAuthService.authState.subscribe((user) => {
      this.socialLogin(user);

    });
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  closeMenu(): void {
    this.isVisible = false;
  }

  openRegisterDrawer() {
    this.openRegisterDrawerEvent.emit();
    this.modalService.closeLoginDrawerEvent();
  }

  openResetPasswordDrawer() {
    this.openResetPasswordDrawerEvent.emit();
    this.modalService.closeLoginDrawerEvent();
  }

  submitForm() {
    // validate
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.invalid) {
      return;
    }
    const data = this.loginForm.value;
    this.isLoading = true;
    this.authService.login(data).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.loginSuccessAction();
          this.storageService.set(environment.loginMethod, LoginMethod.NORMAL);
        }
        else {
          this.loginForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => (this.isLoading = false))
    )
      .subscribe();
  }

  socialLogin(user: SocialUser) {
    this.isLoading = true;
    const socialLoginData: SocialLogin = {
      email: user.email,
      provider: user.provider,
      imageUrl: user.photoUrl,
      fullName: user.name,
      providerKey: user.id,
      token: user.authToken ?? user.idToken
    };

    this.authService.socialLogin(socialLoginData).pipe(
      tap(result => {
        if (result.isSuccess) {
          this.loginSuccessAction();
          this.storageService.set(environment.loginMethod, LoginMethod.SOCIAL);
        }
        else {
          this.loginForm.setErrors({ error: result.errorMessage });
        }
      }),
      finalize(() => (this.isLoading = false))
    )
      .subscribe();

  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }

  loginSuccessAction() {
    this.shareService.authenticateEvent(true);
    this.closeMenu();
    this.messageService.success('Login successfully!');
    this.loginForm.reset();
    this.getCustomerDetail();
    this.getCart();
    this.getWishList();
  }

  getWishList() {
    this.productService.getWishList(new BaseParams(1, 50), this.jwtService.getUserId()).pipe(
    ).subscribe(res => {
      this.shareService.wishListEmitEvent(res.data.data);
    });
  }

  getCart() {
    this.cartService.getCartById(this.jwtService.getUserId()).subscribe((res) => {
      if (res.isSuccess) {
        this.shareService.cartEmitEvent(res.data);
      }
    });
  }

  getCustomerDetail() {
    const userId = this.jwtService.getUserId();
    this.authService.getUserById(userId).subscribe(res => {
      if (res.isSuccess) {
        this.shareService.customerInfoChangeEvent(res.data);
      }
    });
  }

}
