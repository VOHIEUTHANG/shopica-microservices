export interface PurchaseOrderDetail {
    id?: number;
    productId: number;
    productName: string;
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    price: number;
    quantity: number;
    imageUrl: string;
}