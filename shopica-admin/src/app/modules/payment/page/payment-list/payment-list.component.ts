import { Component } from '@angular/core';
import { Payment, PaymentStatus } from '../../models/payment';
import { BaseParams } from '@app/modules/common/base-params';
import { PaymentService } from '../../services/payment.service';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { OrderStatus } from '@app/modules/order/model/order';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent {
  listData: Payment[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);
  public paymentStatus = PaymentStatus;

  selectedData!: Payment;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly paymentService: PaymentService,
    private readonly utilitiesService: UtilitiesService) {
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
      this.baseParam.filters = [{ key: "paymentMethodName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.paymentService.getAllPayment(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }
  reset(): void {
    this.visible = false;
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'paymentMethodName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'paymentMethodName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }

  viewOrder(orderId: number) {
  }
}
