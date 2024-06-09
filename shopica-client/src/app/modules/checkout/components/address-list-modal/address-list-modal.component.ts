import { CheckoutService } from './../../../../core/services/checkout/checkout.service';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ShippingAddress } from '@core/model/address/shipping-address';
import { BaseParams } from '@core/model/base-params';
import { AddressService } from '@core/services/address/address.service';
import { JwtService } from '@core/services/jwt/jwt.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-address-list-modal',
  templateUrl: './address-list-modal.component.html',
  styleUrl: './address-list-modal.component.css'
})
export class AddressListModalComponent implements OnInit {
  @Input() isVisible;
  @Output() closeAddressModalEvent = new EventEmitter();
  @Output() selectAddressModalEvent = new EventEmitter<ShippingAddress>();
  addressList: ShippingAddress[] = [];

  selectedData!: ShippingAddress;
  modalTitle!: string;
  isEditMode: boolean = false;
  showAddAddressModal: boolean;

  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly addressService: AddressService,
    private readonly jwtService: JwtService,
    private readonly messageService: NzMessageService
  ) {

  }
  ngOnInit(): void {
    this.addressService.getAddressList(new BaseParams(1, 50), this.jwtService.getUserId()).subscribe(res => {
      if (res.isSuccess) {
        this.addressList = res.data.data;
      }
    })
  }

  handleCancel() {
    this.closeAddressModalEvent.emit();
  }

  selectAddress(address: ShippingAddress) {
    this.selectAddressModalEvent.emit(address);
  }

  closeModal() {
    this.showAddAddressModal = false;
  }

  insertAddressSuccess(data: ShippingAddress) {
    if (data.default) {
      this.addressList.forEach(a => a.default = false);
    }

    this.addressList = [
      ...this.addressList,
      data
    ];
    this.showAddAddressModal = false;
  }

  updateAddressSuccess(data: ShippingAddress) {
    if (data.default) {
      this.addressList.forEach(a => a.default = false);
    }
    const index = this.addressList.findIndex(r => r.id === data.id);
    Object.assign(this.addressList[index], data);
    this.showAddAddressModal = false;
  }

  showModal() {
    this.modalTitle = 'ADD ADDRESS';
    this.showAddAddressModal = true;
    this.isEditMode = false;
  }

  editAddress(data: ShippingAddress) {
    this.modalTitle = 'EDIT ADDRESS';
    this.selectedData = { ...data };
    this.showAddAddressModal = true;
    this.isEditMode = true;
  }


  deleteAddress(id: number) {
    this.addressService.delete(id).subscribe(res => {
      if (res.isSuccess) {
        this.messageService.create('success', `Delete address successfully!`);
        this.addressList = this.addressList.filter(val => val.id !== id);
      }
    });
  }
}
