import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '@env';
import { BaseResponse } from '@core/model/base-response';
import { AwsS3Presigned } from '@core/model/aws-s3-presigned';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {

  constructor(private readonly httpClient: HttpClient) { }

  getPreSignedUrl(fileName: string, folder: string, contentType: string): Observable<BaseResponse<AwsS3Presigned>> {
    return this.httpClient.get<BaseResponse<AwsS3Presigned>>(`${environment.gatewayServiceUrl}/api/awss3/get-presigned-url?contentType=${contentType}&fileName=${fileName}&folder=${folder}`)
      .pipe(
        catchError((error) => of(error))
      )
  }

  uploadFileToS3(url: string, body: any): Observable<any> {
    return this.httpClient.put(url, body).pipe(
      catchError((error) => of(error))
    )
  }

  delete(fileKey: string): Observable<BaseResponse<boolean>> {
    return this.httpClient.delete<BaseResponse<boolean>>(`${environment.gatewayServiceUrl}/api/awss3?fileKey=${fileKey}`)
      .pipe(
        catchError((error) => of(error))
      )
  }
}
