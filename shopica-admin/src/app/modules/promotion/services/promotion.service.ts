import { PaginatedResult } from '@app/modules/common/paginated-result';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@app/modules/common/base-params';
import { BaseResponse } from '@app/modules/common/base-response';
import { BaseService } from '@app/modules/common/base-service';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Promotion } from '../model/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  constructor(private readonly httpClient: HttpClient) { }

  getById(code: string): Observable<BaseResponse<Promotion>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/promotions/${code}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  create(promotion: Promotion): Observable<BaseResponse<Promotion>> {
    return this.httpClient
      .post<BaseResponse<Promotion>>(`${environment.gatewayServiceUrl}/api/promotions`, promotion)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(promotionCode: string): Observable<BaseResponse<boolean>> {
    return this.httpClient
      .delete<BaseResponse<Promotion>>(
        `${environment.gatewayServiceUrl}/api/promotions/${promotionCode}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Promotion>>> {
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
      .get<BaseResponse<Promotion>>(
        `${environment.gatewayServiceUrl}/api/promotions`, { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }


  update(promotion: Promotion): Observable<BaseResponse<Promotion>> {
    return this.httpClient.patch<BaseResponse<Promotion>>(`${environment.gatewayServiceUrl}/api/promotions`, promotion)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
