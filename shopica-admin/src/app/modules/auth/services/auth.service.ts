import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Login } from '@app/modules/auth/models/login';
import { BaseResponse } from '@app/modules/common/base-response';
import { environment } from '@env';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginResponse } from '@app/modules/auth/models/login-response';
import { StorageService } from '@app/core/services/storage/storage.service';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly jwtHelperService: JwtHelperService,
    private readonly storageService: StorageService,
    private readonly utilitiesService: UtilitiesService) {
  }

  login(request: Login): Observable<BaseResponse<LoginResponse>> {
    return this.httpClient.post<BaseResponse<LoginResponse>>(`${environment.userServiceUrl}/api/users/login`, request).pipe(
      tap(result => {
        if (result.isSuccess) {
          const tokenObject = this.jwtHelperService.decodeToken(result.data.token);

          if (tokenObject.roleName != "SUPER" && tokenObject.role != "Seller") {
            result.isSuccess = false;
            result.errorMessage = "You do haven't permission to access this page!";
            return of(result);
          }
          const user = {
            ...tokenObject,
            token: result.data.token
          };
          this.storageService.setObject(environment.tokenKey, user);
        }
      }),
      catchError(error => {
        return of(error.error);
      })
    );
  }

  isAuthenticated() {
    return this.utilitiesService.isTokeExpire();
  }
}
