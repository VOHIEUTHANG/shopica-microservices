import { User } from '../model/user';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UtilitiesService } from '@core/services/utilities/utilities.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { StorageService } from '@app/core/services/storage/storage.service';
import { BaseResponse } from '@app/modules/common/base-response';
import { ChangePasswordRequest } from '../model/change-password-request';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private userSource = new Subject<User>();
  currentUser = this.userSource.asObservable();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService) { }

  getUserDetail(userId: number): Observable<BaseResponse<User>> {
    return this.httpClient.get(`${environment.userServiceUrl}/api/users/${userId}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  changeUserInfo(newUser: User) {
    let user = this.storageService.getObject(environment.tokenKey);
    user.username = newUser.username;
    user.imageUrl = newUser.imageUrl;
    this.storageService.setObject(environment.tokenKey, user);
    this.userSource.next(user);
  }


  updateUserInfo(userInfo: User): Observable<BaseResponse<User>> {
    return this.httpClient.patch(`${environment.userServiceUrl}/api/users`, userInfo).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  changePassword(changePasswordObject: ChangePasswordRequest): Observable<BaseResponse<boolean>> {
    return this.httpClient.post(`${environment.userServiceUrl}/api/users/change-password`, changePasswordObject).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
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
}
