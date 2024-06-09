import { Transaction } from "./transaction";

export interface Payment {
  id?: number;
  amount: number;
  paymentDate: Date,
  paymentMethodId: number;
  paymentStatus: PaymentStatus,
  customerId: number;
  transactions: Transaction[]
}

export enum PaymentStatus {
  Pending,
  Processed
}
