import { Address } from '@modules/profile/model/address';
import { ProfileService } from '@modules/profile/services/profile.service';
import { GhnService } from '@core/services/ghn/ghn.service';
import { District } from '@modules/profile/model/district';
import { Ward } from '@modules/profile/model/ward';
import { Province } from '@modules/profile/model/province';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { environment } from '@env';
import { User } from '@app/modules/profile/model/user';
import { Observable, combineLatest, of, timer } from 'rxjs';
import { switchMap, finalize, map } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { AwsS3Service } from '@app/core/services/aws-s3/aws-s3.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.css']
})
export class UpdateInfoComponent implements OnInit {

  userUpdateForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  listProvince: Province[] = [];
  listWard: Ward[] = [];
  listDistrict: District[] = [];
  districtIdSelected = 0;
  wardIdSelected: string = '0';
  isLoadingSubmit = false;
  isLoadingUserDetail = true;
  initialUsernameValue: string;
  userId: number;
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp';
  addressId: number;
  user: User;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly ghnService: GhnService,
    private readonly profileService: ProfileService,
    private readonly messageService: NzMessageService,
    private readonly utilitiesService: UtilitiesService,
    private readonly awsS3Service: AwsS3Service
  ) { }

  ngOnInit(): void {
    this.userId = this.utilitiesService.getUserId();
    this.buildForm();

    combineLatest([
      this.ghnService.getProvinces(),
      this.profileService.getUserDetail(this.userId)
    ]).subscribe(res => {

      if (res[0].code === 200) {
        this.listProvince = res[0].data;
      }
      this.isLoadingUserDetail = false;
      this.user = res[1].data;
      this.setFormValue();
    });
  }

  setFormValue() {
    if (this.user.addresses.length > 0) {
      this.addressId = this.user.addresses[0].id;
      this.districtIdSelected = this.user.addresses[0].districtId;
      this.wardIdSelected = this.user.addresses[0].wardCode;
      const province = this.listProvince.find(x => x.ProvinceID === this.user.addresses[0].provinceId);
      const street = this.user.addresses[0].street;
      this.userUpdateForm.controls.province.setValue(province);
      this.userUpdateForm.controls.street.setValue(street);
    }
    this.initialUsernameValue = this.user.username;
    this.userUpdateForm.controls['username'].setValue(this.user.username);
    this.userUpdateForm.controls['gender'].setValue(this.user.gender);
    this.userUpdateForm.controls['phone'].setValue(this.user.phone);
    this.userUpdateForm.controls['email'].setValue(this.user.email);
    this.userUpdateForm.controls['fullName'].setValue(this.user.fullName);

    let listImage = [];
    let file = {
      uid: -1,
      url: this.user.imageUrl,
      name: 'image.png',
    };
    listImage.push(file)
    this.fileList = listImage;
  }


  buildForm() {
    this.userUpdateForm = this.formBuilder.group({
      username: [null, Validators.required, this.existUsernameValidator],
      gender: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      fullName: [null, Validators.required],
      province: [null, Validators.required],
      ward: [null, Validators.required],
      district: [null, Validators.required],
      street: [null, Validators.required],
    })

    // this.userUpdateForm.controls['email'].disable();
  }

  existUsernameValidator = (control: FormControl) => {
    if (control.value == this.initialUsernameValue) {
      return of(null);
    }
    return timer(1000).pipe(
      switchMap(() => this.profileService.checkUsernameExist(control.value)),
    )
  }

  loadProvinces() {
    this.ghnService.getProvinces().subscribe(res => {
      if (res.code == 200) {
        this.listProvince = res.data;
      }
    })
  }

  loadDistricts(provinceID: number) {
    this.ghnService.getDistricts(provinceID).subscribe(res => {
      if (res.code == 200) {
        this.listDistrict = res.data;
        const districtSelect = this.districtIdSelected !== 0 ? this.listDistrict.find(x => x.DistrictID == this.districtIdSelected) : this.listDistrict[0];
        this.userUpdateForm.controls['district'].setValue(districtSelect)
        this.districtIdSelected = 0;
      }
    })
  }

  loadWards(districtID: number) {
    this.ghnService.getWards(districtID).subscribe(res => {
      if (res.code == 200) {
        this.listWard = res.data;
        const wardSelect = this.wardIdSelected !== '-1' ? this.listWard.find(x => x.WardCode == this.wardIdSelected) : this.listWard[0];
        this.userUpdateForm.controls['ward'].setValue(wardSelect)
        this.wardIdSelected = '-1';
      }
    })
  }

  provinceChange(province: Province): void {
    this.loadDistricts(province.ProvinceID);
  }

  districtChange(district: District): void {
    this.loadWards(district.DistrictID);
  }

  submitForm() {
    const province = this.userUpdateForm.get('province').value;
    const district = this.userUpdateForm.get('district').value;
    const ward = this.userUpdateForm.get('ward').value;
    const street = this.userUpdateForm.get('street').value;

    const address: Address = {
      id: this.addressId,
      provinceId: province.ProvinceID,
      provinceName: province.ProvinceName,
      districtId: district.DistrictID,
      districtName: district.DistrictName,
      wardCode: ward.WardCode,
      wardName: ward.WardName,
      street: street,
      fullAddress: `${street} - ${ward.WardName} - ${district.DistrictName} - ${province.ProvinceName}`
    };

    const userInfo: User = {
      id: this.userId,
      email: this.userUpdateForm.get("email").value,
      phone: this.userUpdateForm.get("phone").value,
      username: this.userUpdateForm.get("username").value,
      gender: parseInt(this.userUpdateForm.get("gender").value),
      fullName: this.userUpdateForm.get("fullName").value,
      addresses: [address],
      imageUrl: this.fileList[0].url,
    }

    this.isLoadingSubmit = true;
    this.profileService.updateUserInfo(userInfo).
      pipe(
        finalize(() => this.isLoadingSubmit = false)
      ).subscribe(res => {
        if (res.isSuccess) {
          this.messageService.create("success", "update info successfully");
          this.profileService.changeUserInfo(userInfo);
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
