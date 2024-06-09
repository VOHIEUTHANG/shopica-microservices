import { BaseParams } from './../../../common/base-params';
import { finalize } from 'rxjs/operators';
import { SizeService } from './../../services/size.service';
import { Component, OnInit } from '@angular/core';
import { Size } from '../../models/size';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { pipe } from 'rxjs';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';


@Component({
  selector: 'app-size-list',
  templateUrl: './size-list.component.html',
  styleUrls: ['./size-list.component.css']
})
export class SizeListComponent implements OnInit {
  listData: Size[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: Size;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly sizeService: SizeService, private readonly utilitiesService: UtilitiesService) {
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
      this.baseParam.filters = [{ key: "sizeName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.sizeService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showModal() {
    this.modalTitle = 'ADD SIZE';
    this.isShowModal = true;
    this.isEditMode = false;
  }

  editSize(data: Size) {
    this.modalTitle = 'EDIT SIZE';
    this.selectedData = { ...data };
    this.isShowModal = true;
    this.isEditMode = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.isEditMode
  }

  insertSizeSuccess(data: Size) {
    this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updateSizeSuccess(data: Size) {
    const index = this.listData.findIndex(r => r.id === data.id);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deleteSize(id: number) {
    this.isLoading = true;
    this.sizeService.delete(id).pipe(
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'sizeName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'sizeName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
