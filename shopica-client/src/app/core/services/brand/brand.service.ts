import { catchError } from 'rxjs/operators';
import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { Brand } from '@core/model/brand/brand';
import { BaseParams } from '@core/model/base-params';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  getAllBrand(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Brand>>> {
    const params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/brands`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }
}
