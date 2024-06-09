import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { PromotionRequest } from '@core/model/promotion/promotion-request';
import { PromotionResponse } from '@core/model/promotion/promotion-response';
import { environment } from '@env';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {


  constructor(private readonly httpClient: HttpClient) { }


  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<PromotionResponse>>> {
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
      .get<BaseResponse<PromotionResponse>>(
        `${environment.gatewayServiceUrl}/api/promotions`,
        { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getValidPromotions(baseParams: BaseParams, request: PromotionRequest): Observable<BaseResponse<PaginatedResult<PromotionResponse>>> {
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
      .post<BaseResponse<PromotionResponse>>(
        `${environment.gatewayServiceUrl}/api/promotions/get-valid-promotions`, request,
        { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  applyPromotion(request: PromotionRequest): Observable<BaseResponse<PromotionResponse>> {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/promotions/apply-promotion`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  removePromotion(customerId: number, promotionCode: string): Observable<BaseResponse<PromotionResponse>> {
    const params = new HttpParams()
      .append('customerId', `${customerId}`)
      .append('promotionCode', `${promotionCode}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/promotions/unapply-promotion`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  };
}
