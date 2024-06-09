export interface WarehouseEntry {
    id?: number;
    productId: number;
    productName: string;
    colorId: number;
    colorName: string;
    sizeId: number;
    sizeName: string;
    quantity: number;
    sourceDocument: WarehouseEntrySourceDocument;
    sourceNo: number;
    sourceLineNo: number;
}
export enum WarehouseEntrySourceDocument {
    SalesOrder,
    PurchaseOrder
}