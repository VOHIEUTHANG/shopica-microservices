import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { BaseResponse } from '@core/model/base-response';
import { Blog } from '@core/model/blog/blog';
import { PaginatedResult } from '@core/model/paginated-result';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private readonly httpClient: HttpClient) { }

  getAllBlog(baseParam: BaseParams): Observable<BaseResponse<PaginatedResult<Blog>>> {
    let params = new HttpParams()
      .append('pageIndex', baseParam.pageIndex)
      .append('pageSize', baseParam.pageSize);

    if (baseParam.sortField != null) {
      params = params.append('sortField', `${baseParam.sortField}`)
        .append('sortOrder', `${baseParam.sortOrder}`);
    }

    if (baseParam.filters.length > 0) {
      baseParam.filters.forEach(filter => {
        params = params.append(filter.key, filter.value);
      });
    }

    if (baseParam.filters.length > 0) {
      baseParam.filters.forEach(filter => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient
      .get<BaseResponse<Blog>>(`${environment.gatewayServiceUrl}/api/blogs`, {
        params,
      })
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getDataForSideBlog() {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/blogs/blog-all-store`).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );

  }

  getBlogById(id: number): Observable<BaseResponse<Blog>> {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/blogs/${id}`).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

  getBlogTags(): Observable<BaseResponse<string[]>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/blogs/get-tags`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }
}
