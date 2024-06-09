import { BaseParams } from '../../common/base-params';
import { BaseResponse } from '@app/modules/common/base-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Size } from '../models/size';
import { BaseService } from '@app/modules/common/base-service';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root'
})
export class SizeService implements BaseService<Size> {

  constructor(private readonly httpClient: HttpClient) { }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Size>>> {
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

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/sizes`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  create(data: Size): Observable<BaseResponse<Size>> {
    return this.httpClient.post<BaseResponse<Size>>(`${environment.gatewayServiceUrl}/api/sizes`, data).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  delete(sizeId: number): Observable<BaseResponse<boolean>> {
    return this.httpClient.delete<BaseResponse<Size>>(`${environment.gatewayServiceUrl}/api/sizes/${sizeId}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  update(size: Size): Observable<BaseResponse<Size>> {
    return this.httpClient.patch<BaseResponse<Size>>(`${environment.gatewayServiceUrl}/api/sizes`, size)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
