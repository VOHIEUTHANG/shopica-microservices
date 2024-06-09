export interface Transaction {
  id?: number;
  description: string;
  transactionDate: Date,
  externalTransactionId?: string;
}
