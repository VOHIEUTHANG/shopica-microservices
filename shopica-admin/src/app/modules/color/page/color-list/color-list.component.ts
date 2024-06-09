import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { BaseParams } from '@app/modules/common/base-params';
import { Color } from '@modules/color/models/Color';
import { ColorService } from '@modules/color/services/color.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.css'],
})
export class ColorListComponent implements OnInit {

  listData: Color[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: Color;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly colorService: ColorService, private readonly utilitiesService: UtilitiesService) {
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
      this.baseParam.filters = [{ key: "colorName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.colorService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showModal() {
    this.modalTitle = 'ADD COLOR';
    this.isShowModal = true;
    this.isEditMode = false;
  }

  editColor(data: Color) {
    this.modalTitle = 'EDIT COLOR';
    this.selectedData = { ...data };
    this.isShowModal = true;
    this.isEditMode = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.isEditMode
  }

  insertColorSuccess(data: Color) {
    this.listData = this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updateColorSuccess(data: Color) {
    const index = this.listData.findIndex(r => r.id === data.id);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deleteColor(id: number) {
    this.isLoading = true;
    this.colorService.delete(id).pipe(
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'colorName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'colorName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
