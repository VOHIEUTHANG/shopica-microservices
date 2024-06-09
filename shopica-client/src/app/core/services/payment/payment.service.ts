import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { Payment } from '@core/model/payment/payment';
import { PaymentMethod } from '@core/model/payment/payment-method';
import { environment } from '@env';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private readonly httpClient: HttpClient) { }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<PaymentMethod>>> {
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

  createPayment(payment: Payment): Observable<BaseResponse<Payment>> {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/payments`, payment).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

}
