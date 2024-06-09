export interface CartItem {
  customerId?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  available?: number;
  colorId: number;
  sizeId: number;
  colorName: string;
  sizeName: string;
  imageUrl: string;
  isPromotionLine?: boolean;
  promotionCode?: string;
}
