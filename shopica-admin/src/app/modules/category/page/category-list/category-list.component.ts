import { Component, OnInit } from '@angular/core';
import { Category } from '@modules/category/models/category';
import { CategoryService } from '@modules/category/services/category.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { BaseParams } from '@app/modules/common/base-params';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  listData: Category[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);

  selectedData!: Category;
  isShowModal: boolean = false;
  modalTitle!: string;
  isEditMode: boolean = false;

  constructor(private readonly categoryService: CategoryService, private readonly utilitiesService: UtilitiesService) {
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
      this.baseParam.filters = [{ key: "categoryName", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.categoryService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }

  showModal() {
    this.modalTitle = 'ADD CATEGORY';
    this.isShowModal = true;
    this.isEditMode = false;
  }

  editCategory(data: Category) {
    this.modalTitle = 'EDIT CATEGORY';
    this.selectedData = { ...data };
    this.isShowModal = true;
    this.isEditMode = true;
  }

  closeModal() {
    this.isShowModal = false;
    this.isEditMode
  }

  insertCategorySuccess(data: Category) {
    this.listData = [
      ...this.listData,
      data
    ];
    this.total++;
    this.isShowModal = false;
  }

  updateCategorySuccess(data: Category) {
    const index = this.listData.findIndex(r => r.id === data.id);
    Object.assign(this.listData[index], data);
    this.isShowModal = false;
  }

  deleteCategory(id: number) {
    this.isLoading = true;
    this.categoryService.delete(id).pipe(
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'categoryName');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'categoryName', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
