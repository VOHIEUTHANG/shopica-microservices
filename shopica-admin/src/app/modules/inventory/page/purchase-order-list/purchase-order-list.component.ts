import { Component } from '@angular/core';
import { PurchaseOrder } from '../../models/purchase-order';
import { BaseParams } from '@app/modules/common/base-params';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { OrderStatus } from '@app/modules/order/model/order';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.css'
})
export class PurchaseOrderListComponent {
  filterParams = new BaseParams(1, 5);
  listData: PurchaseOrder[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);
  public orderStatus = OrderStatus;

  filterStatus = [
    { text: 'Submitted', value: OrderStatus.Submitted },
    { text: 'Pending', value: OrderStatus.Pending },
    { text: 'Delivering', value: OrderStatus.Delivering },
    { text: 'Shipped', value: OrderStatus.Shipped },
    { text: 'Cancelled', value: OrderStatus.Cancelled },
  ];

  constructor(
    private readonly purchaseorderService: PurchaseOrderService,
    private readonly router: Router,
  ) {

  }
  selectedValue = null;

  ngOnInit(): void {
  }

  onQueryParamsChange = (params: NzTableQueryParams) => {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);

    this.baseParam.pageIndex = pageIndex;
    this.baseParam.pageSize = pageSize;
    this.baseParam.sortField = (currentSort && currentSort.key) || undefined;
    this.baseParam.sortOrder = (currentSort && currentSort.value) || undefined;
    this.baseParam.filters = filter.filter(f => f.value.length > 0);


    if (this.searchValue !== '') {
      this.baseParam.filters = [{ key: "purchaseorderName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.purchaseorderService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }


  viewPurchaseOrder(purchaseOrderId: number) {
    this.router.navigate(['/admin/inventory/purchase-order-detail', purchaseOrderId]);
  }

  addPurchaseOrder() {
    this.router.navigate(['/admin/inventory/add-purchase-order']);
  }

  reset(): void {
    this.visible = false;
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'purchaseorderName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'purchaseorderName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }

}
