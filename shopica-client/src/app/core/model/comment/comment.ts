export interface Comment {
  id?: number;
  content: string;
  customerId: number;
  email: string;
  customerName: string;
  customerImageUrl: string;
  createdAt?: string;
  rate: number;
  documentType: CommentDocumentType;
  documentId: number;
}

export enum CommentDocumentType {
  Product,
  Blog
}