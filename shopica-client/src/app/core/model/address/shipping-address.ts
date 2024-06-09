import { Address } from './address';

export interface ShippingAddress {
  id?: number;
  customerId: number;
  customerName: string;
  phone: string;
  email: string;
  fullAddress: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: number;
  wardCode: string;
  wardName: string;
  street: string;
  notes?: string;
  saveAddress?: boolean;
  default: boolean;
}
