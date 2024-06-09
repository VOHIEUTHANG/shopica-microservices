import { Routes } from "@angular/router";
import { PurchaseOrderListComponent } from "./page/purchase-order-list/purchase-order-list.component";
import { PurchaseOrderDetailComponent } from "./page/purchase-order-detail/purchase-order-detail.component";
import { WarehouseEntryListComponent } from "./page/warehouse-entry-list/warehouse-entry-list.component";

export const purchaseOrderRoute: Routes = [
    {
        path: 'purchase-orders', data: {
            breadcrumb: 'PurchaseOrder'
        },
        component: PurchaseOrderListComponent,
    },
    {
        path: 'warehouse-entries',
        data: {
            breadcrumb: 'WarehouseEntry'
        },
        component: WarehouseEntryListComponent,
    },
    {
        path: 'add-purchase-order',
        data: {
            breadcrumb: 'Add'
        },
        component: PurchaseOrderDetailComponent,
    },
    {
        path: 'purchase-order-detail/:purchaseOrderId',
        data: {
            breadcrumb: 'Detail'
        },
        component: PurchaseOrderDetailComponent,
    }
]