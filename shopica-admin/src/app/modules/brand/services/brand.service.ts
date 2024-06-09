import { BaseParams } from './../../common/base-params';
import { BaseService } from '@app/modules/common/base-service';
import { Brand } from '@modules/brand/models/brand';
import { BaseResponse } from '@modules/common/base-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root'
})

export class BrandService implements BaseService<Brand> {

  constructor(private readonly httpClient: HttpClient) { }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Brand>>> {
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

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/brands`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  create(brand: Brand): Observable<BaseResponse<Brand>> {
    return this.httpClient.post<BaseResponse<Brand>>(`${environment.gatewayServiceUrl}/api/brands`, brand).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  delete(brandId: number) {

    return this.httpClient.delete<BaseResponse<Brand>>(`${environment.gatewayServiceUrl}/api/brands/${brandId}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  update(category: Brand): Observable<BaseResponse<Brand>> {
    return this.httpClient.patch<BaseResponse<Brand>>(`${environment.gatewayServiceUrl}/api/brands`, category)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
