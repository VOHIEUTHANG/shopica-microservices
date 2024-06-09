import { Address } from '@core/model/address/address';

export interface Customer {
  id: number;
  addresses: Address[];
  email: string;
  gender: number;
  phone: string;
  username: string;
  imageUrl?: string;
  fullName: string;
}
