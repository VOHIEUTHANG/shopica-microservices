import { OrderStatus } from "@app/modules/order/model/order";
import { PurchaseOrderDetail } from "./purchase-order-detail";

export interface PurchaseOrder {
    id?: number;
    totalPrice: number;
    orderDate: Date;
    status: OrderStatus;
    purchaseOrderDetails: PurchaseOrderDetail[];
}