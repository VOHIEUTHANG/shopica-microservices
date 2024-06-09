export interface Notify {
  id: string;
  content: string;
  sourceDocumentId: string;
  sourceEvent: NotificationSourceEvent;
  senderId: number;
  recipientId: number;
  isRead: boolean;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  createdAt: Date;
}

export enum NotificationSourceEvent {
  OrderCreated,
  ProductCreated,
  PromotionCreated
}