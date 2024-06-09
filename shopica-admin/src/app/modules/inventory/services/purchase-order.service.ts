import { Injectable } from '@angular/core';
import { BaseResponse } from '@app/modules/common/base-response';
import { Observable, catchError, map, of } from 'rxjs';
import { PurchaseOrder } from '../models/purchase-order';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResult } from '@app/modules/common/paginated-result';
import { BaseParams } from '@app/modules/common/base-params';
import { WarehouseEntry } from '../models/warehouse-entry';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  constructor(private readonly httpClient: HttpClient) { }

  getById(id: number): Observable<BaseResponse<PurchaseOrder>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/purchaseorders/${id}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  create(product: PurchaseOrder): Observable<BaseResponse<PurchaseOrder>> {
    return this.httpClient
      .post<BaseResponse<PurchaseOrder>>(
        `${environment.gatewayServiceUrl}/api/purchaseorders`,
        product
      ).pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  update(product: PurchaseOrder): Observable<BaseResponse<PurchaseOrder>> {
    return this.httpClient
      .patch<BaseResponse<PurchaseOrder>>(
        `${environment.gatewayServiceUrl}/api/purchaseorders`,
        product
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }


  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<PurchaseOrder>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    if (baseParams.sortField != null) {
      params = params
        .append('sortField', `${baseParams.sortField}`)
        .append('sortOrder', `${baseParams.sortOrder}`);
    }

    if (baseParams.filters.length > 0) {
      baseParams.filters.forEach((filter) => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient
      .get<BaseResponse<PaginatedResult<PurchaseOrder>>>(
        `${environment.gatewayServiceUrl}/api/purchaseorders`, { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getWarehouseEntries(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<WarehouseEntry>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    if (baseParams.sortField != null) {
      params = params
        .append('sortField', `${baseParams.sortField}`)
        .append('sortOrder', `${baseParams.sortOrder}`);
    }

    if (baseParams.filters.length > 0) {
      baseParams.filters.forEach((filter) => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient
      .get<BaseResponse<PaginatedResult<WarehouseEntry>>>(
        `${environment.gatewayServiceUrl}/api/inventory`, { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }
}
