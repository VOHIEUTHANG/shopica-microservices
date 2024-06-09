import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GhnService {
  private options = {
    headers: {
      ['token']: environment.ghnToken
    },
  };

  constructor(private readonly httpClient: HttpClient) { }

  getProvinces() {
    return this.httpClient.get(`${environment.ghnAPIUrl}/master-data/province`, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getDistricts(provinceId: number) {
    const body = {
      province_id: provinceId
    };
    return this.httpClient.post(`${environment.ghnAPIUrl}/master-data/district`, body, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  getWards(districtId: number) {
    const body = {
      district_id: districtId
    };
    return this.httpClient.post(`${environment.ghnAPIUrl}/master-data/ward`, body, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

  calculateShippingFee(fromDistrict: number, toDistrict: number) {
    const body = {
      service_type_id: 2,
      height: 50,
      length: 20,
      weight: 200,
      width: 20,
      from_district_id: fromDistrict,
      to_district_id: toDistrict,
    };

    return this.httpClient.post(`${environment.ghnAPIUrl}/v2/shipping-order/fee`, body, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    );
  }

}
