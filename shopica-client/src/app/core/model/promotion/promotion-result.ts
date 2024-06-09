import { PromotionType } from "./promotion-response";

export interface PromotionResult {
  id: number;
  orderId: number
  promotionCode: string;
  promotionType: PromotionType;
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
}
