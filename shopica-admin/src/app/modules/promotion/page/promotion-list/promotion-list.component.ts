import { PromotionService } from './../../services/promotion.service';
import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../model/promotion';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { BaseParams } from '@app/modules/common/base-params';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.css']
})
export class PromotionListComponent implements OnInit {
  listData: Promotion[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: Promotion;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly promotionService: PromotionService,
    private readonly router: Router) {
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
      this.baseParam.filters = [{ key: "description", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.promotionService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  insertPromotionSuccess(data: Promotion) {
    this.listData = this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updatePromotionSuccess(data: Promotion) {
    const index = this.listData.findIndex(r => r.code === data.code);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deletePromotion(code: string) {
    this.isLoading = true;
    this.promotionService.delete(code).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if (res.isSuccess) {
        if (this.listData.length == 1 && this.total > 1 && this.total > 1)
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'description');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'description', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }


  addPromotion() {
    this.router.navigate(['/admin/promotion/add']);
  }
  editPromotion(promotionCode: string) {
    this.router.navigate(['/admin/promotion/detail', promotionCode]);
  }
}
