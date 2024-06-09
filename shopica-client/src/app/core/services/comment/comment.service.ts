import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { BaseResponse } from '@core/model/base-response';
import { Comment } from '@core/model/comment/comment';
import { PaginatedResult } from '@core/model/paginated-result';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private readonly httpClient: HttpClient) { }

  getAllComment(baseParams: BaseParams, documentTypes: string, documentId: number): Observable<BaseResponse<PaginatedResult<Comment>>> {

    const params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`)
      .append('documentTypes', documentTypes)
      .append('documentId', `${documentId}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/comments`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  likeComment(id: number, isLike: boolean) {
    const params = new HttpParams()
      .append('isLike', isLike.toString());
    return this.httpClient.get<Comment>(`${environment.gatewayServiceUrl}/api/comments/${id}`, { params }).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

  sendComment(request: Comment): Observable<BaseResponse<Comment>> {
    return this.httpClient.post<Comment>(`${environment.gatewayServiceUrl}/api/comments`, request).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

  deleteComment(id: number) {
    return this.httpClient.delete(`${environment.gatewayServiceUrl}/api/comments/${id}`).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

  editComment(comment: Comment): Observable<BaseResponse<Comment>> {
    return this.httpClient.patch(`${environment.gatewayServiceUrl}/api/comments`, comment).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

  checkInteractive(id: number) {
    return this.httpClient.get<Object>(`${environment.gatewayServiceUrl}/api/comment/interactive/${id}`).pipe(
      catchError((error) => {
        return of(error.error);
      })
    );
  }

}
