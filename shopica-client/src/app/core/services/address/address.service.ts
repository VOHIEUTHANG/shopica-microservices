import { PaginatedResult } from './../../model/paginated-result';
import { BaseParams } from './../../model/base-params';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { BaseResponse } from '@core/model/base-response';
import { environment } from '@env';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private readonly httpClient: HttpClient) { }



  create(address: ShippingAddress): Observable<BaseResponse<ShippingAddress>> {
    return this.httpClient
      .post<BaseResponse<ShippingAddress>>(`${environment.gatewayServiceUrl}/api/addresses`, address)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getAddressList(baseParam: BaseParams, customerId: number): Observable<BaseResponse<PaginatedResult<ShippingAddress>>> {

    let params = new HttpParams()
      .append('pageIndex', `${baseParam.pageIndex}`)
      .append('pageSize', `${baseParam.pageSize}`)
      .append('customerId', `${customerId}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/addresses`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getAddressDefault(customerId: number): Observable<BaseResponse<ShippingAddress>> {
    return this.httpClient.get<BaseResponse<ShippingAddress>>(`${environment.gatewayServiceUrl}/api/addresses/get-default?customerId=${customerId}`)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }

  update(address: ShippingAddress): Observable<BaseResponse<ShippingAddress>> {
    return this.httpClient.patch<BaseResponse<ShippingAddress>>(`${environment.gatewayServiceUrl}/api/addresses`, address)
      .pipe(
        catchError((error) => { return of(error.error) })
      )
  }

  delete(addressId: number): Observable<BaseResponse<boolean>> {
    return this.httpClient.delete<BaseResponse<boolean>>(`${environment.gatewayServiceUrl}/api/addresses/${addressId}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }
}
