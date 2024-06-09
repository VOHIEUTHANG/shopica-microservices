import { Address } from "./address";

export interface User {
  id: number;
  addresses: Address[];
  email: string;
  gender: number;
  phone: string;
  username: string;
  imageUrl: string;
  fullName: string;
}
