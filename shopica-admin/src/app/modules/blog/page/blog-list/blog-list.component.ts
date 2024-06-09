import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { BaseParams } from '@app/modules/common/base-params';
import { Blog } from '../../models/blog';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {
  filterParams = new BaseParams(1, 5);
  listData: Blog[] = [];
  isLoading: boolean = false;
  total: number = 0;
  searchValue = '';
  visible: boolean = false;
  baseParam: BaseParams = new BaseParams(1, 5);
  constructor(
    private readonly blogService: BlogService,
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
      this.baseParam.filters = [{ key: "title", value: this.searchValue }];
    }

    this.loadDataFromServer(this.baseParam);
  }

  loadDataFromServer(baseParam: BaseParams): void {
    this.isLoading = true;
    this.blogService.getAll(baseParam).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(response => {

      this.listData = response.data.data;
      this.total = response.data.count;
    });
  }


  editBlog(blogId: number) {
    this.router.navigate(['/admin/blog/detail', blogId]);
  }

  addBlog() {
    this.router.navigate(['/admin/blog/add']);
  }

  deleteBlog(id: number) {
    this.isLoading = true;
    this.blogService.delete(id).pipe(
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
    this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'title');

    if (this.searchValue !== '') {
      this.baseParam.filters.push({ key: 'title', value: this.searchValue });
    }
    this.loadDataFromServer(this.baseParam);
  }
}
