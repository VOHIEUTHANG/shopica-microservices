import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { Category } from '@core/model/category/category';
import { BaseParams } from '@core/model/base-params';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  getAllCategory(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Category>>> {
    const params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/categories`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }
}
