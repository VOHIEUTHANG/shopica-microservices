import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse } from '@app/modules/common/base-response';
import { environment } from '@env';
import { Report } from '../models/report';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductRevenues } from '../models/product-revenues';
import { ProductByCategory } from '../models/product-by-category';
import { ProductBycolor } from '../models/product-by-color';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private readonly httpClient: HttpClient) { }

  getData(fromDate: string, toDate: string, top: number) {
    let params = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('TOP', top.toString())
      .append('sortOrder', 'ascend');
    return this.httpClient
      .get<BaseResponse<Report>>(
        `${environment.gatewayServiceUrl}/api/report/by-date`,
        { params }
      )
      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }

  exportExcel(fromDate: string, toDate: string, top: number) {
    let params = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('Top', top.toString())
      .append('sortOrder', 'ascend');
    return this.httpClient
      .get(
        `${environment.gatewayServiceUrl}/api/report/export-excel`, { responseType: 'blob', params })

      .pipe(
        catchError((error) => {
          return of(error.error);
        })
      );
  }


  getTotalOrders(): Observable<BaseResponse<number>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/orders/get-total-sales-order`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getTotalRevenues(): Observable<BaseResponse<number>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/orders/get-total-revenues`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getTotalUsers(): Observable<BaseResponse<number>> {
    return this.httpClient
      .get(`${environment.userServiceUrl}/api/users/get-total-users`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getTotalProducts(): Observable<BaseResponse<number>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/products/get-total-products`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getProductRevenues(): Observable<BaseResponse<ProductRevenues[]>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/orders/get-product-revenues`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getProductByCategory(): Observable<BaseResponse<ProductByCategory[]>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/products/get-product-by-category`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }

  getProductByColor(): Observable<BaseResponse<ProductBycolor[]>> {
    return this.httpClient
      .get(`${environment.gatewayServiceUrl}/api/orders/get-product-by-color`)
      .pipe(
        catchError((err) => {
          return of(err.error);
        })
      );
  }
}
