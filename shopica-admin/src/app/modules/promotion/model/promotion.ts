
export interface Promotion {
  code: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: PromotionType;
  salesById: number;
  salesByName: string;
  salesByQuantity: number;
  salesByAmount: number;
  promotionById: number;
  promotionByName: string;
  promotionColorName: string;
  promotionColorId: number;
  promotionSizeName: string;
  promotionSizeId: number;
  promotionImageUrl: string;
  promotionPrice: number;
  promotionQuantity: number;
  promotionAmount: number;
  promotionDiscount: number;
  promotionDiscountLimit: number;
  active: boolean;
}


export enum PromotionType {
  Amount,
  Discount,
  Product
}
