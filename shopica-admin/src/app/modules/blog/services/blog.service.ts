import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@app/modules/common/base-params';
import { BaseResponse } from '@app/modules/common/base-response';
import { BaseService } from '@app/modules/common/base-service';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { blogRoutes } from '../blog.routing';
import { Blog } from '../models/blog';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class BlogService implements BaseService<Blog> {
  constructor(private readonly httpClient: HttpClient) { }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Blog>>> {
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
      .get<BaseResponse<Blog>>(`${environment.gatewayServiceUrl}/api/blogs`, {
        params,
      })
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  create(data: Blog): Observable<BaseResponse<Blog>> {
    return this.httpClient
      .post<BaseResponse<Blog>>(
        `${environment.gatewayServiceUrl}/api/blogs`,
        data
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(id: number) {
    return this.httpClient
      .delete<BaseResponse<Blog>>(
        `${environment.gatewayServiceUrl}/api/blogs/${id}`
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  update(blog: Blog): Observable<BaseResponse<Blog>> {
    return this.httpClient
      .patch<BaseResponse<Blog>>(
        `${environment.gatewayServiceUrl}/api/blogs`,
        blog
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getBlogState() {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/blog/blog-state`)
      .pipe(
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

  getBlogById(id: number): Observable<BaseResponse<Blog>> {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/blogs/${id}`).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }
}
