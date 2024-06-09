import { BehaviorSubject } from 'rxjs';
import { ProductSearch } from './../model/product-search';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BaseService } from '@app/modules/common/base-service';
import { Product } from '../model/product';
import { BaseResponse } from '@app/modules/common/base-response';
import { BaseParams } from '@app/modules/common/base-params';
import { PaginatedResult } from '@app/modules/common/paginated-result';
import { ProductImage } from '../model/product-image';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly httpClient: HttpClient) { }

  getById(id: number): Observable<BaseResponse<Product>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/products/${id}`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  create(product: Product): Observable<BaseResponse<Product>> {
    return this.httpClient
      .post<BaseResponse<Product>>(
        `${environment.gatewayServiceUrl}/api/products`,
        product
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  update(product: Product): Observable<BaseResponse<Product>> {
    return this.httpClient
      .patch<BaseResponse<Product>>(
        `${environment.gatewayServiceUrl}/api/products`,
        product
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  delete(productId: number): Observable<BaseResponse<boolean>> {
    return this.httpClient
      .delete<BaseResponse<Product>>(
        `${environment.gatewayServiceUrl}/api/products/${productId}`
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getAll(baseParams: BaseParams, productSearch?: ProductSearch): Observable<BaseResponse<PaginatedResult<Product>>> {
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
      .get<BaseResponse<PaginatedResult<Product>>>(
        `${environment.gatewayServiceUrl}/api/products`, { params }
      )
      .pipe(
        map((res) => {
          res.data.data.forEach((element) => {
            if (element.productImages.length == 0) {
              element.productImages.push({
                imageUrl:
                  'https://drive.google.com/thumbnail?id=1KXVcuCEi-aYgrJXkUwV_RODDh5cT5qHv',
              });
            }
          });
          return res;
        }),
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  deleteImage(id: string, imageUrl: string): Observable<BaseResponse<boolean>> {
    return this.httpClient
      .delete<BaseResponse<string>>(
        `${environment.gatewayServiceUrl}/api/productimages/${id}?imageUrl=${imageUrl}`
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  addImage(productImage: ProductImage): Observable<BaseResponse<ProductImage>> {
    return this.httpClient
      .post<BaseResponse<Product>>(
        `${environment.gatewayServiceUrl}/api/productimages`,
        productImage
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  getProductTags(): Observable<BaseResponse<string[]>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/products/get-tags`)
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }
}
