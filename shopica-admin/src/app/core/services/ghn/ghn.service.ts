import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
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
    )
  }

  getDistricts(provinceId: number) {
    const body = {
      province_id: provinceId
    }
    return this.httpClient.post(`${environment.ghnAPIUrl}/master-data/district`, body, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

  getWards(districtId: number) {
    const body = {
      district_id: districtId
    }
    return this.httpClient.post(`${environment.ghnAPIUrl}/master-data/ward`, body, this.options).pipe(
      catchError(error => {
        return of(error.error);
      })
    )
  }

}
