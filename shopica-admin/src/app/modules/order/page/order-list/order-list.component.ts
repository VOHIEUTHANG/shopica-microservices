import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Order, OrderStatus } from '../../model/order';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';
import { BaseParams } from '@app/modules/common/base-params';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  listData: Order[] = [];
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
    private readonly orderService: OrderService,
    private readonly nzImageService: NzImageService,
    private readonly router: Router
  ) {
  }

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
      this.baseParam.filters = [{ key: "customerName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }


  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.orderService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {
      if (response.isSuccess) {
        this.listData = response.data.data;
        this.total = response.data.count;
      }

    });
  }

  showQrCode(qrCodeUrl: string) {
    let listNzImages: NzImage[] = [];
    listNzImages.push({
      src: qrCodeUrl
    });

    this.nzImageService.preview(listNzImages, { nzZoom: 1, nzRotate: 0 })
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/admin/order/detail', orderId]);
  }

  reset(): void {
    this.visible = false;
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'customerName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'customerName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
