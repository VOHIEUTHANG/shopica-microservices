import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@core/model/base-response';
import { Contract } from '@core/model/contact/contact';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private readonly httpClient: HttpClient) { }

  createContact(body: Contract): Observable<BaseResponse<boolean>> {
    return this.httpClient
      .post<BaseResponse<Contract>>(
        `${environment.gatewayServiceUrl}/api/mail/contact`,
        body
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }
}
