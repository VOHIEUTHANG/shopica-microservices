import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from './../share/share.service';
import { Cart } from './../../model/cart/cart';
import { environment } from './../../../../environments/environment';
import { JwtService } from './../jwt/jwt.service';
import { BaseResponse } from '../../model/base-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '@core/model/user/login';
import { SocialLogin } from '@core/model/user/social-login';
import { ResetPasswordRequest } from '@core/model/user/reset-password-request';
import { RegisterRequest } from '@core/model/user/register-request';
import { LoginResponse } from '@core/model/user/login-response';
import { RegisterResponse } from '@core/model/user/register-response';
import { Customer } from '@core/model/user/customer';
import { ChangePasswordRequest } from '@core/model/user/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly jwtHelperService: JwtHelperService,
    private readonly storageService: StorageService,
    private readonly jwtService: JwtService,
    private readonly shareService: ShareService,
  ) { }


  login(request: Login): Observable<BaseResponse<LoginResponse>> {
    return this.httpClient.post<BaseResponse<LoginResponse>>(`${environment.userServiceUrl}/api/users/login`, request).pipe(
      map(res => {
        if (res.isSuccess) {
          const tokenObject = this.jwtHelperService.decodeToken(res.data.token);
          if (tokenObject.roleName !== 'DEFAULT') {
            res.isSuccess = false;
            res.errorMessage = "Username or password is incorrect!";
            return res;
          }
          const user = {
            ...tokenObject,
            token: res.data
          };
          this.storageService.setObject(environment.tokenKey, user);
          return res;
        }
      }),
      catchError(error => {
        return of(error.error);
      })
    );
  }

  socialLogin(request: SocialLogin): Observable<BaseResponse<LoginResponse>> {
    return this.httpClient.post<BaseResponse<LoginResponse>>(`${environment.userServiceUrl}/api/users/social-login`, request).pipe(
      map(res => {
        if (res.isSuccess) {
          const tokenObject = this.jwtHelperService.decodeToken(res.data.token);
          const user = {
            ...tokenObject,
            token: res.data
          };
          this.storageService.setObject(environment.tokenKey, user);
          return res;
        }
      }),
      catchError(error => {
        return of(error.error);
      })
    );
  }

  register(request: RegisterRequest): Observable<BaseResponse<RegisterResponse>> {
    return this.httpClient.post<BaseResponse<string>>(`${environment.userServiceUrl}/api/users`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }


  logout(): void {
    this.shareService.cartEmitEvent(new Cart());
    this.shareService.wishListEmitEvent([]);
    this.storageService.remove(environment.tokenKey);
    this.storageService.remove(environment.loginMethod);
    this.shareService.authenticateEvent(false);
  }

  isAuthenticated(): boolean {
    return this.jwtService.isTokeExpire();
  }

  checkUsernameExist(username: string): Observable<ValidationErrors> {
    return this.httpClient.get<BaseResponse<boolean>>(`${environment.userServiceUrl}/api/users/check-exists?username=${username}`).pipe(
      map(result => {
        if (!result.data) {
          return null;
        }
        else {
          return { error: true, duplicated: true };
        }
      }),
      catchError(error => {
        return of({ error: true, duplicated: true });
      })
    );
  }

  sendVerifyCode(email: string): Observable<BaseResponse<boolean>> {
    return this.httpClient.get(`${environment.userServiceUrl}/api/users/generate-token-reset-password?email=${email}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<BaseResponse<boolean>> {
    return this.httpClient.post<BaseResponse<string>>(`${environment.userServiceUrl}/api/users/reset-password`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getUserById(userId: number): Observable<BaseResponse<Customer>> {
    return this.httpClient.get(`${environment.userServiceUrl}/api/users/${userId}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  updateInfo(request: Customer): Observable<BaseResponse<Customer>> {
    return this.httpClient.patch(`${environment.userServiceUrl}/api/users`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<BaseResponse<boolean>> {
    return this.httpClient.post(`${environment.userServiceUrl}/api/users/change-password`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }


}
