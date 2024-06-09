import { catchError } from 'rxjs/operators';
import { Notify } from '@models/notifies/notify';
import { BaseResponse } from '@app/modules/common/base-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilitiesService } from '../utilities/utilities.service';
import { environment } from '@env';
import { of, Observable } from 'rxjs';
import { BaseParams } from '@app/modules/common/base-params';
import { PaginatedResult } from '@app/modules/common/paginated-result';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly utilitiesService: UtilitiesService) { }

  getAllNotify(baseParams: BaseParams, sourceEvents: string): Observable<BaseResponse<PaginatedResult<Notify>>> {
    const storeId = this.utilitiesService.getStoreId();

    let params = new HttpParams()
      .append("pageIndex", baseParams.pageIndex)
      .append("pageSize", baseParams.pageSize)
      .append("sourceEvents", sourceEvents);

      if (baseParams.sortField != null) {
        params = params.append('sortField', `${baseParams.sortField}`)
          .append('sortOrder', `${baseParams.sortOrder}`);
      }

    return this.httpClient.get<BaseResponse<any>>(`${environment.gatewayServiceUrl}/api/notifications`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  updateReadNotification() : Observable<BaseResponse<boolean>>{
    return this.httpClient.get<BaseResponse<any>>(`${environment.gatewayServiceUrl}/api/notifications/update-read-notification`).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }
}
