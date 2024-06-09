import { BrandService } from '@modules/brand/services/brand.service';
import { Brand } from '@modules/brand/models/brand';
import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { BaseParams } from '@app/modules/common/base-params';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  listData: Brand[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: Brand;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly brandService: BrandService, private readonly utilitiesService: UtilitiesService) {
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
      this.baseParam.filters = [{ key: "brandName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.brandService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showModal() {
    this.modalTitle = 'ADD BRAND';
    this.isShowModal = true;
    this.isEditMode = false;
  }

  editBrand(data: Brand) {
    this.modalTitle = 'EDIT BRAND';
    this.selectedData = { ...data };
    this.isShowModal = true;
    this.isEditMode = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.isEditMode
  }

  insertBrandSuccess(data: Brand) {
    this.listData = this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updateBrandSuccess(data: Brand) {
    const index = this.listData.findIndex(r => r.id === data.id);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deleteBrand(id: number) {
    this.isLoading = true;
    this.brandService.delete(id).pipe(
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'brandName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'brandName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
