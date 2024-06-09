import { StorageService } from '@core/services/storage/storage.service';
import { Address } from '@core/model/address/address';
import { ShippingAddress } from '../../../../core/model/address/shipping-address';
import { Customer } from '@core/model/user/customer';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CartItem } from '@core/model/cart/cart-item';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { GhnService } from '@core/services/ghn/ghn.service';
import { ShareService } from '@core/services/share/share.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest } from 'rxjs';
import { environment } from '@env';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { AddressService } from '@core/services/address/address.service';
import { JwtService } from '@core/services/jwt/jwt.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  orderForm: UntypedFormGroup;
  listProvince = [];
  listDistrict = [];
  listWard = [];
  isLoading = false;
  districtSelectedId = 0;
  wardSelectedId = '-1';
  addressId: number;
  showAddressList: boolean;
  storeAddress: Address;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly addressService: AddressService,
    private readonly ghnService: GhnService,
    private readonly router: Router,
    private readonly shareService: StorageService,
    private readonly checkoutService: CheckoutService,
    private readonly jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    combineLatest([
      this.ghnService.getProvinces(),
      this.addressService.getAddressDefault(this.jwtService.getUserId())
    ]).subscribe(res => {
      if (res[0].code === 200) {
        this.listProvince = res[0].data;
      }
      if (res[1].isSuccess)
        this.setFormValue(res[1].data);
    });

    this.getShippingAddress();
  }

  buildForm() {
    this.orderForm = this.formBuilder.group({
      customerName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      province: [null, Validators.required],
      ward: [null, Validators.required],
      district: [null, Validators.required],
      street: [null, Validators.required],
      notes: [null, Validators.required],
      saveAddress: [null, Validators.required],
    });
  }

  setFormValue(address: ShippingAddress) {
    this.addressId = address.id;
    this.districtSelectedId = address.districtId;
    this.wardSelectedId = address.wardCode;
    const province = this.listProvince.find(x => x.ProvinceID === address.provinceId);
    const street = address.street;
    this.orderForm.controls.province.setValue(province);
    this.orderForm.controls.street.setValue(street);

    this.orderForm.controls.customerName.setValue(address.customerName);
    this.orderForm.controls.phone.setValue(address.phone);
    this.orderForm.controls.email.setValue(address.email);

  }

  provinceChange(province): void {
    this.loadDistricts(province.ProvinceID);
  }

  districtChange(district): void {
    this.loadWards(district.DistrictID);
    this.calculateShippingFee();
  }

  loadDistricts(provinceID: number) {
    this.ghnService.getDistricts(provinceID).subscribe(res => {
      if (res.code === 200) {
        this.listDistrict = res.data;
        const district = this.districtSelectedId !== 0 ? this.listDistrict.find(x => x.DistrictID === this.districtSelectedId) : this.listDistrict[0];
        this.orderForm.controls.district.setValue(district);
        this.districtSelectedId = 0;
      }
    });
  }

  loadWards(districtID: number) {
    this.ghnService.getWards(districtID).subscribe(res => {
      if (res.code === 200) {
        this.listWard = res.data;
        const ward = this.wardSelectedId !== '-1' ? this.listWard.find(x => x.WardCode == this.wardSelectedId) : this.listWard[0];
        this.orderForm.controls.ward.setValue(ward);
        this.wardSelectedId = '-1';
      }
    });
  }

  public getOrderInformation(): ShippingAddress {
    const province = this.orderForm.get('province').value;
    const district = this.orderForm.get('district').value;
    const ward = this.orderForm.get('ward').value;
    const street = this.orderForm.get('street').value;
    const shippingAddress: ShippingAddress = {
      customerId: this.jwtService.getUserId(),
      customerName: this.orderForm.get('customerName').value,
      phone: this.orderForm.get('phone').value,
      email: this.orderForm.get('email').value,
      notes: this.orderForm.get('notes').value ?? '',
      saveAddress: this.orderForm.get('saveAddress').value ?? false,
      provinceId: province.ProvinceID,
      provinceName: province.ProvinceName,
      districtId: district.DistrictID,
      districtName: district.DistrictName,
      wardCode: ward.WardCode,
      wardName: ward.WardName,
      street: street,
      fullAddress: `${street} - ${ward.WardName} - ${district.DistrictName} - ${province.ProvinceName}`,
      default: false
    };
    return shippingAddress;
  }

  selectAddress(address: ShippingAddress) {
    this.orderForm.controls.customerName.setValue(address.customerName);
    this.orderForm.controls.phone.setValue(address.phone);
    this.orderForm.controls.email.setValue(address.email);
    const province = this.listProvince.find(x => x.ProvinceID === address.provinceId);
    this.districtSelectedId = address.districtId;
    this.wardSelectedId = address.wardCode;
    const street = address.street;
    this.orderForm.controls.province.setValue(province);
    this.orderForm.controls.street.setValue(street);
    this.showAddressList = false;
    this.calculateShippingFee();
  }

  getShippingAddress() {
    this.checkoutService.getStoreAddress()
      .subscribe(res => {
        if (res.isSuccess) {
          this.storeAddress = res.data;
        }
      })
  }

  calculateShippingFee() {
    this.ghnService.calculateShippingFee(this.storeAddress.districtId, this.orderForm.get('district').value.DistrictID)
      .subscribe(res => {
        this.checkoutService.shippingPriceChange(res.data.total / environment.USDToVND)
      })
  }
}
