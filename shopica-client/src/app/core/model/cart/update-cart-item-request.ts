export interface UpdateCartItemRequest {
  customerId?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  available?: number;
  colorId: number;
  oldColorId: number;
  sizeId: number;
  oldSizeId: number;
  colorName: string;
  sizeName: string;
  imageUrl: string;
  isPromotionLine?: boolean;
  promotionCode?: string;
}
