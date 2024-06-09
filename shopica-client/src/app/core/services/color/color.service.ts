import { environment } from '@env';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { Color } from '@core/model/color/color';
import { BaseParams } from '@core/model/base-params';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(
    private readonly httpClient: HttpClient,
  ) { }

  getAllColor(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Color>>> {
    const params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/colors`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }
}
