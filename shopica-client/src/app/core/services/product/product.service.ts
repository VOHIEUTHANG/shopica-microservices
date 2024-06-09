import { JwtService } from './../jwt/jwt.service';
import { catchError } from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { ProductOptions } from './../../model/product/product-option';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseParams } from '@core/model/base-params';
import { Observable, of } from 'rxjs';
import { ProductSort } from '@core/model/product/product-sort';
import { BaseResponse } from '@core/model/base-response';
import { PaginatedResult } from '@core/model/paginated-result';
import { Product } from '@core/model/product/product';
import { Wishlist } from '@core/model/product/wishlist';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly jwtService: JwtService
  ) { }

  getListProduct(baseParams: BaseParams): Observable<BaseResponse<PaginatedResult<Product>>> {
    let params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`);

    if (baseParams.sortField != null) {
      params = params
        .append('sortField', `${baseParams.sortField}`)
        .append('sortOrder', `${baseParams.sortOrder}`);
    }

    if (baseParams.filters.length > 0) {
      baseParams.filters.forEach(filter => {
        params = params.append(filter.key, filter.value);
      });
    }

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/products`,
      { params }).pipe(
        catchError(error => {
          return of(error.error);
        })
      );
  }

  getProductById(id: number): Observable<BaseResponse<Product>> {
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/products/${id}`).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }


  getProductRecommender() {
    const userId = this.jwtService.getUserId();
    return this.httpClient.get(`${environment.gatewayServiceUrl}/predict/${userId}/`).pipe(catchError(error => {
      return of(error.error);
    }));
  }

  searchProductByFullText(pageIndex: number, pageSize: number, keywords: string[]) {
    let params = new HttpParams().append('pageIndex', (pageIndex - 1).toString())
      .append('pageSize', pageSize.toString());
    keywords.forEach(x => {
      params = params.append('keywords', x);
    })
    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/products/fulltext-search`, { params }).pipe(catchError(error => {
      return of(error.error);
    }));
  }

  addToWishList(wishlist: Wishlist): Observable<BaseResponse<Wishlist>> {
    return this.httpClient.post(`${environment.gatewayServiceUrl}/api/wishlists`, wishlist).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  removeWishList(customerId: number, productId: number): Observable<BaseResponse<Wishlist>> {
    const params = new HttpParams()
      .append('customerId', customerId)
      .append('productId', productId);
    return this.httpClient.delete(`${environment.gatewayServiceUrl}/api/wishlists`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getWishList(baseParams: BaseParams, customerId: number): Observable<BaseResponse<PaginatedResult<Wishlist>>> {

    const params = new HttpParams()
      .append('pageIndex', `${baseParams.pageIndex}`)
      .append('pageSize', `${baseParams.pageSize}`)
      .append('customerId', `${customerId}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/wishlists`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getProductByIds(productIds: string): Observable<BaseResponse<Product[]>> {

    const params = new HttpParams()
      .append('productIds', `${productIds}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/products/get-by-ids`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getAvailableQuantity(productId: number, sizeId: number, colorId: number): Observable<BaseResponse<number>> {
    const params = new HttpParams()
      .append('productId', `${productId}`)
      .append('sizeId', `${sizeId}`)
      .append('colorId', `${colorId}`);

    return this.httpClient.get(`${environment.gatewayServiceUrl}/api/inventory/get-available-quantity`, { params }).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }
}

