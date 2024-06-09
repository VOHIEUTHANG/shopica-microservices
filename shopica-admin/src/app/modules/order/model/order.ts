import { Address } from './../../profile/model/address';
import { OrderDetail } from './order-detail';
export interface Order {
  id?: number;
  customerId: number;
  customerName: string;
  notes?: string;
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
  status: OrderStatus;
  totalPrice: number;
  discount?: number;
  promotionCode?: string;
  paymentId: number;
  shippingCost: number;
  createdAt: Date;
  orderDetails: OrderDetail[];
}
export enum OrderStatus {
  Submitted,
  Pending,
  Delivering,
  Shipped,
  Cancelled
}
