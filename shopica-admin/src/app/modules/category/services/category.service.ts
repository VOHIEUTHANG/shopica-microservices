import { BaseParams } from '@modules/common/base-params';
import { Category } from './../models/category';
import { BaseService } from '@app/modules/common/base-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@modules/common/base-response';
import { Observable, of } from 'rxjs';
import { environment } from '@env';
import { catchError } from 'rxjs/operators';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root',
})

export class CategoryService implements BaseService<Category> {
  constructor(private readonly httpClient: HttpClient) { }

  create(category: Category): Observable<BaseResponse<Category>> {
    return this.httpClient
      .post<BaseResponse<Category>>(`${environment.gatewayServiceUrl}/api/categories`, category)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(categoryId: number): Observable<BaseResponse<boolean>> {
    return this.httpClient.delete<BaseResponse<boolean>>(`${environment.gatewayServiceUrl}/api/categories/${categoryId}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getAllCategory() {
    return this.httpClient
      .get<BaseResponse<Category>>(
        `${environment.gatewayServiceUrl}/api/categories`,
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Category>>> {
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
      .get<BaseResponse<Category>>(
        `${environment.gatewayServiceUrl}/api/categories`,
        { params }
      )
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  update(category: Category): Observable<BaseResponse<Category>> {
    return this.httpClient.patch<BaseResponse<Category>>(`${environment.gatewayServiceUrl}/api/categories`, category)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
