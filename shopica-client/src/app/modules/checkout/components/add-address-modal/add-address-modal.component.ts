import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { GhnService } from '@core/services/ghn/ghn.service';
import { combineLatest, finalize } from 'rxjs';
import { ShareService } from '@core/services/share/share.service';
import { Customer } from '@core/model/user/customer';
import { AddressService } from '@core/services/address/address.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrl: './add-address-modal.component.css'
})
export class AddAddressModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() address!: ShippingAddress;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<ShippingAddress>();
  @Output() updateSuccessEvent = new EventEmitter<ShippingAddress>();
  baseForm: FormGroup;
  isLoadingButton = false;
  listProvince = [];
  listDistrict = [];
  listWard = [];
  districtSelectedId = 0;
  wardSelectedId = '-1';
  customer: Customer;

  constructor(private readonly formBuilder: UntypedFormBuilder,
    private readonly ghnService: GhnService,
    private readonly shareService: ShareService,
    private readonly addressService: AddressService,
    private readonly messageService: NzMessageService
  ) {

  }
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

  buildForm() {
    this.baseForm = this.formBuilder.group({
      customerName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      province: [null, Validators.required],
      ward: [null, Validators.required],
      district: [null, Validators.required],
      street: [null, Validators.required],
      default: [null],
    });
  }

  setFormValue() {
    this.baseForm.controls.customerName.setValue(this.customer?.fullName);
    this.baseForm.controls.phone.setValue(this.customer?.phone);
    this.baseForm.controls.email.setValue(this.customer?.email);

    if (this.customer?.addresses) {
      this.districtSelectedId = this.customer.addresses[0].districtId;
      this.wardSelectedId = this.customer.addresses[0].wardCode;
      const province = this.listProvince.find(x => x.ProvinceID === this.customer.addresses[0].provinceId);
      const street = this.customer.addresses[0].street;
      this.baseForm.controls.province.setValue(province);
      this.baseForm.controls.street.setValue(street);
      this.provinceChange(province);
    }
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
  }

  submitForm() {
    const province = this.baseForm.get('province').value;
    const district = this.baseForm.get('district').value;
    const ward = this.baseForm.get('ward').value;
    const street = this.baseForm.get('street').value;
    const request: ShippingAddress = {
      customerId: this.customer.id,
      customerName: this.baseForm.get('customerName').value,
      phone: this.baseForm.get('phone').value,
      email: this.baseForm.get('email').value,
      provinceId: province.ProvinceID,
      provinceName: province.ProvinceName,
      districtId: district.DistrictID,
      districtName: district.DistrictName,
      wardCode: ward.WardCode,
      wardName: ward.WardName,
      street: street,
      default: this.baseForm.get('default').value ?? false,
      fullAddress: `${street} - ${ward.WardName} - ${district.DistrictName} - ${province.ProvinceName}`
    };

    if (this.isEditMode) {
      request.id = this.address.id;
      this.updateAddress(request);
    }
    else {
      this.addAddress(request);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] != undefined && changes['address'].currentValue != undefined) {
      this.baseForm.controls.customerName.setValue(changes['address'].currentValue.customerName);
      this.baseForm.controls.phone.setValue(changes['address'].currentValue.phone);
      this.baseForm.controls.email.setValue(changes['address'].currentValue.email);
      this.baseForm.controls.default.setValue(changes['address'].currentValue.default);

      this.districtSelectedId = changes['address'].currentValue.districtId;
      this.wardSelectedId = changes['address'].currentValue.wardCode;
      const province = this.listProvince.find(x => x.ProvinceID === changes['address'].currentValue.provinceId);
      const street = changes['address'].currentValue.street;
      this.baseForm.controls['province'].setValue(province);
      this.baseForm.controls.street.setValue(street);
      this.provinceChange(province);
    }

    if (changes['isVisible'] != undefined && changes['isVisible'].currentValue != undefined) {
      if (!this.isEditMode)
        this.setFormValue();
    }
  }

  provinceChange(province): void {
    if (province)
      this.loadDistricts(province.ProvinceID);
  }

  districtChange(district): void {
    if (district)
      this.loadWards(district.DistrictID);
  }

  loadDistricts(provinceID: number) {
    this.ghnService.getDistricts(provinceID).subscribe(res => {
      if (res.code === 200) {
        this.listDistrict = res.data;
        const district = this.districtSelectedId !== 0 ? this.listDistrict.find(x => x.DistrictID === this.districtSelectedId) : this.listDistrict[0];
        this.baseForm.controls.district.setValue(district);
        // this.districtSelectedId = 0;
        this.districtChange(district);
      }
    });
  }

  loadWards(districtID: number) {
    this.ghnService.getWards(districtID).subscribe(res => {
      if (res.code === 200) {
        this.listWard = res.data;
        const ward = this.wardSelectedId !== '-1' ? this.listWard.find(x => x.WardCode == this.wardSelectedId) : this.listWard[0];
        this.baseForm.controls.ward.setValue(ward);
        // this.wardSelectedId = '-1';
      }
    });
  }


  addAddress(category: ShippingAddress) {
    this.addressService.create(category)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create address successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }

  updateAddress(address: ShippingAddress) {
    this.addressService.update(address)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update address successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
        }
      });
  }

}
