import { Injectable, Pipe } from '@angular/core';
import { PaymentMethod } from '../models/payment-method';
import { Observable, catchError, of, pipe } from 'rxjs';
import { BaseResponse } from '@app/modules/common/base-response';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '@app/modules/common/paginated-result';
import { BaseParams } from '@app/modules/common/base-params';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private readonly httpClient: HttpClient) { }

  create(paymentMethod: PaymentMethod): Observable<BaseResponse<PaymentMethod>> {
    return this.httpClient
      .post<BaseResponse<PaymentMethod>>(`${environment.gatewayServiceUrl}/api/paymentmethods`, paymentMethod)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(paymentMethodId: number): Observable<BaseResponse<boolean>> {
    return this.httpClient.delete<BaseResponse<boolean>>(`${environment.gatewayServiceUrl}/api/paymentmethods/${paymentMethodId}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getAllPaymentMethod(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<PaymentMethod>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`)

    if (baseParams.sortField != null) {
      params = params.append('sortField', `${baseParams.sortField}`)
        .append('sortOrder', `${baseParams.sortOrder}`);
    }

    if (baseParams.filters.length > 0) {
      baseParams.filters.forEach(filter => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient
      .get<BaseResponse<PaymentMethod>>(
        `${environment.gatewayServiceUrl}/api/paymentmethods`,
        { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getAllPayment(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Payment>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`)

    if (baseParams.sortField != null) {
      params = params.append('sortField', `${baseParams.sortField}`)
        .append('sortOrder', `${baseParams.sortOrder}`);
    }

    if (baseParams.filters.length > 0) {
      baseParams.filters.forEach(filter => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient
      .get<BaseResponse<PaymentMethod>>(
        `${environment.gatewayServiceUrl}/api/payments`,
        { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }



  update(paymentMethod: PaymentMethod): Observable<BaseResponse<PaymentMethod>> {
    return this.httpClient.patch<BaseResponse<PaymentMethod>>(`${environment.gatewayServiceUrl}/api/paymentmethods`, paymentMethod)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
