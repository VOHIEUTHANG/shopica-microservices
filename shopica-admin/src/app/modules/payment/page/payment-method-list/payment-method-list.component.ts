import { Component } from '@angular/core';
import { PaymentMethod } from '../../models/payment-method';
import { BaseParams } from '@app/modules/common/base-params';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { PaymentService } from '../../services/payment.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrl: './payment-method-list.component.css'
})
export class PaymentMethodListComponent {
  listData: PaymentMethod[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: PaymentMethod;
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
    this.paymentService.getAllPaymentMethod(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showModal() {
    this.modalTitle = 'ADD PAYMENT METHOD';
    this.isShowModal = true;
    this.isEditMode = false;
  }

  editPaymentMethod(data: PaymentMethod) {
    this.modalTitle = 'EDIT PAYMENT METHOD';
    this.selectedData = { ...data };
    this.isShowModal = true;
    this.isEditMode = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.isEditMode
  }

  insertPaymentMethodSuccess(data: PaymentMethod) {
    this.listData = this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updatePaymentMethodSuccess(data: PaymentMethod) {
    const index = this.listData.findIndex(r => r.id === data.id);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deletePaymentMethod(id: number) {
    this.isLoading = true;
    this.paymentService.delete(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        if (this.listData.length == 1 && this.total > 1)
          this.baseParam.pageIndex -= 1;
        this.loadDataFromServer(this.baseParam);
      }
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
}
