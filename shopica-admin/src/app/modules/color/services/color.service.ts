import { Color } from '@modules/color/models/Color';
import { BaseParams } from '@modules/common/base-params';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@modules/common/base-response';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root',
})

export class ColorService {
  constructor(private readonly httpClient: HttpClient) { }

  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Color>>> {
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

    return this.httpClient.get<BaseResponse<PaginatedResult<Color>>>(`${environment.gatewayServiceUrl}/api/colors`, {
      params,
    })
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(colorId: number) {
    return this.httpClient
      .delete<BaseResponse<Color>>(`${environment.gatewayServiceUrl}/api/colors/${colorId}`).pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  create(color: Color): Observable<BaseResponse<Color>> {
    return this.httpClient
      .post<BaseResponse<Color>>(`${environment.gatewayServiceUrl}/api/colors`, color)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }
  update(color: Color): Observable<BaseResponse<Color>> {
    return this.httpClient.patch<BaseResponse<Color>>(`${environment.gatewayServiceUrl}/api/colors`, color)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }
}
