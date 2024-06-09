import { PromotionRequestDetail } from "./promotion-request-detail";

export interface PromotionRequest {
  customerId: number;
  orderDate: Date;
  totalPrice: number;
  promotionCode: string;
  promotionDetails: PromotionRequestDetail[]
}
