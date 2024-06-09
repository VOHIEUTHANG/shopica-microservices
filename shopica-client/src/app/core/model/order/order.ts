import { Address } from '../address/address';
import { ShippingAddress } from '../address/shipping-address';
import { OrderDetail } from './order-details';
export interface Order {
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
  status: OrderStatus;
  totalPrice: number;
  discount?: number;
  promotionCode?: string;
  paymentId: number;
  shippingCost: number;
  saveAddress?: boolean;
  createdAt?: Date;
  orderDetails: OrderDetail[];
}
export enum OrderStatus {
  Submitted,
  Pending,
  Delivering,
  Shipped,
  Cancelled
}

