import { Observable } from "rxjs";
import { BaseParams } from "./base-params";
import { BaseResponse } from "./base-response";
import { PaginatedResult } from "./paginated-result";

export declare interface BaseService<T> {
  getAll(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<T>>>;
  create(data: T): Observable<BaseResponse<T>>;
  delete(id: number, baseParams: BaseParams): Observable<BaseResponse<boolean>>;
}
