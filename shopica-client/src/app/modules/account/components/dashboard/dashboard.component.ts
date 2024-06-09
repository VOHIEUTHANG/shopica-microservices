import { ShareService } from './../../../../core/services/share/share.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { tap, finalize, map } from 'rxjs/operators';
import { Customer } from '@core/model/user/customer';
import { AuthService } from '@core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { JwtService } from '@core/services/jwt/jwt.service';
import { GhnService } from '@core/services/ghn/ghn.service';
import { Observable, combineLatest } from 'rxjs';
import { Address } from '@core/model/address/address';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '@env';
import { AwsS3Service } from '@core/services/aws-s3/aws-s3.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  updateInfoForm: FormGroup;
  customer: Customer;
  isLoading = false;
  listProvince = [];
  listDistrict = [];
  listWard = [];
  districtSelectedId = 0;
  wardSelectedId = '0';
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp';
  fileList: NzUploadFile[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
    private readonly shareService: ShareService,
    private readonly jwtService: JwtService,
    private readonly ghnService: GhnService,
    private readonly awsS3Service: AwsS3Service
  ) { }

  ngOnInit(): void {
    this.buildForm();

    combineLatest([
      this.ghnService.getProvinces(),
      this.shareService.customerInfoEmitted$
    ]).subscribe(res => {

      if (res[0].code === 200) {
        this.listProvince = res[0].data;
      }
      this.customer = res[1];
      this.setFormValue();
    });
  }

  setFormValue() {
    this.updateInfoForm.controls.username.setValue(this.customer.username);
    this.updateInfoForm.controls.username.disable();

    this.updateInfoForm.controls.fullName.setValue(this.customer.fullName);
    this.updateInfoForm.controls.email.setValue(this.customer.email);
    this.updateInfoForm.controls.phone.setValue(this.customer.phone);
    this.updateInfoForm.controls.gender.setValue(this.customer.gender);

    if (this.customer.addresses.length > 0) {
      this.districtSelectedId = this.customer.addresses[0].districtId;
      this.wardSelectedId = this.customer.addresses[0].wardCode;
      const province = this.listProvince.find(x => x.ProvinceID === this.customer.addresses[0].provinceId);
      const street = this.customer.addresses[0].street;
      this.updateInfoForm.controls.province.setValue(province);
      this.updateInfoForm.controls.street.setValue(street);
    }
    let listImage = [];
    let file = {
      uid: -1,
      url: this.customer.imageUrl,
      name: 'image.png',
    };
    listImage.push(file)
    this.fileList = listImage;
  }

  buildForm() {
    this.updateInfoForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      province: [null, Validators.required],
      ward: [null, Validators.required],
      district: [null, Validators.required],
      street: [null, Validators.required],
    });
  }

  updateInfo() {
    const province = this.updateInfoForm.get('province').value;
    const district = this.updateInfoForm.get('district').value;
    const ward = this.updateInfoForm.get('ward').value;
    const street = this.updateInfoForm.get('street').value;

    const address: Address = {
      id: this.customer.addresses[0]?.id,
      provinceId: province.ProvinceID,
      provinceName: province.ProvinceName,
      districtId: district.DistrictID,
      districtName: district.DistrictName,
      wardCode: ward.WardCode,
      wardName: ward.WardName,
      street: street,
      fullAddress: `${street} - ${ward.WardName} - ${district.DistrictName} - ${province.ProvinceName}`
    };

    const userInfo: Customer = {
      id: this.jwtService.getUserId(),
      email: this.updateInfoForm.get("email").value,
      phone: this.updateInfoForm.get("phone").value,
      username: this.updateInfoForm.get("username").value,
      gender: parseInt(this.updateInfoForm.get("gender").value),
      fullName: this.updateInfoForm.get("fullName").value,
      addresses: [address],
      imageUrl: this.fileList[0].url,
    }

    this.isLoading = true;

    this.authService.updateInfo(userInfo).
      pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        if (res.isSuccess) {
          this.messageService.create("success", "update info successfully");
          this.router.navigate(['/account']);
        }
        else {
          this.updateInfoForm.setErrors({ error: res.errorMessage });
        }
      });
  }


  provinceChange(province): void {
    this.loadDistricts(province.ProvinceID);
  }

  districtChange(district): void {
    this.loadWards(district.DistrictID);
  }

  loadDistricts(provinceID: number): void {
    this.ghnService.getDistricts(provinceID).subscribe(res => {
      if (res.code === 200) {
        this.listDistrict = res.data;
        const district = this.districtSelectedId !== 0 ? this.listDistrict.find(x => x.DistrictID == this.districtSelectedId) : this.listDistrict[0];
        this.updateInfoForm.controls.district.setValue(district);
        this.districtSelectedId = 0;
      }
    });
  }

  loadWards(districtID: number) {
    this.ghnService.getWards(districtID).subscribe(res => {
      if (res.code === 200) {
        this.listWard = res.data;
        const ward = this.wardSelectedId !== '0' ? this.listWard.find(x => x.WardCode == this.wardSelectedId) : this.listWard[0];
        this.updateInfoForm.controls.ward.setValue(ward);
        this.wardSelectedId = '0';
      }
    });
  }


  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const folderName = '/user-images/' + new Date().toISOString();
    this.awsS3Service.getPreSignedUrl(file.name, environment.awsFolder + folderName, file.type ?? this.contentTypeAccept).subscribe(
      res => {
        if (res.isSuccess) {
          this.awsS3Service.uploadFileToS3(res.data.uploadUrl, file as any)
            .pipe(
          ).subscribe(() => {
            this.fileList = [{
              uid: res.data.awsFileKey,
              url: res.data.fileUrl,
              name: file.name,
            }];

            this.messageService.success('upload successfully.');
          });
        }
        else {
          this.messageService.create('error', res.errorMessage);
        }
      }
    )

    return false;
  };


  remove = (file: NzUploadFile): Observable<boolean> => {
    return this.awsS3Service.delete(file.uid)
      .pipe(
        map(res => {
          if (!res.isSuccess) {
            this.messageService.error(res.errorMessage);
          }
          return res.data;
        })
      )
  }
}
