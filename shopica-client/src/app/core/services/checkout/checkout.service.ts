import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Order } from '../../model/order/order';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { PromotionRequest } from '@core/model/promotion/promotion-request';
import { BaseResponse } from '@core/model/base-response';
import { PromotionResponse } from '@core/model/promotion/promotion-response';
import { OrderDetail } from '@core/model/order/order-details';
import { BaseParams } from '@core/model/base-params';
import { PaginatedResult } from '@core/model/paginated-result';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { ProductByCount } from '@core/model/product/product-by-count';
import { Address } from '@core/model/address/address';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private productPrice = new BehaviorSubject<number>(0);
  private shippingPrice = new BehaviorSubject<number>(0);
  private discount = new BehaviorSubject<number>(0);

  productPriceEmitted$ = this.productPrice.asObservable();
  shippingPriceEmitted$ = this.shippingPrice.asObservable();
  discountEmitted$ = this.discount.asObservable();

  productPriceChange(price: number) {
    this.productPrice.next(price);
  }

  shippingPriceChange(price: number) {
    this.shippingPrice.next(price);
  }

  discountChange(price: number) {
    this.discount.next(price);
  }

  constructor(private readonly httpClient: HttpClient) { }

  createOrder(order: Order): Observable<BaseResponse<Order>> {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/orders`, order).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getOrderByCustomerId(baseParam: BaseParams, customerId: number): Observable<BaseResponse<PaginatedResult<Order>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParam.pageIndex}`)
      .append('pageSize', `${baseParam.pageSize}`);

    if (baseParam.sortField != null) {
      params = params
        .append('sortField', `${baseParam.sortField}`)
        .append('sortOrder', `${baseParam.sortOrder}`);
    }

    if (baseParam.filters.length > 0) {
      baseParam.filters.forEach((filter) => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/orders?customerId=${customerId}`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getOrderDetailById(id: number): Observable<BaseResponse<Order>> {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/orders/${id}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getBestSeller(): Observable<BaseResponse<ProductByCount[]>> {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/orders/get-best-seller`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getStoreAddress(): Observable<BaseResponse<Address>> {
    return this.httpClient.get(`${environment.userServiceUrl}/api/users/get-store-address`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

}
