import { Cart } from './../../model/cart/cart';
import { StorageService } from './../storage/storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '@env';
import { BaseResponse } from '@core/model/base-response';
import { CartItem } from '@core/model/cart/cart-item';
import { UpdateCartItemRequest } from '@core/model/cart/update-cart-item-request';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly storageService: StorageService
  ) { }

  addToCart(request: CartItem): Observable<BaseResponse<Cart>> {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/carts/add-to-cart`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );

  }

  getCartById(customerId: number): Observable<BaseResponse<Cart>> {

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/carts/${customerId}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }


  changeQuantity(request: CartItem) {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/carts/changeQuantity`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  updateCart(request: UpdateCartItemRequest): Observable<BaseResponse<Cart>> {
    return this.httpClient.patch(`${environment.gatewayServiceUrl}/api/carts`, request).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  deleteCartItem(customerId: number, productId: number, sizeId: number, colorId: number): Observable<BaseResponse<boolean>> {
    const params = new HttpParams()
      .append('customerId', `${customerId}`)
      .append('productId', `${productId}`)
      .append('sizeId', `${sizeId}`)
      .append('colorId', `${colorId}`);
    return this.httpClient.delete(`${environment.gatewayServiceUrl}/api/carts`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }
}
