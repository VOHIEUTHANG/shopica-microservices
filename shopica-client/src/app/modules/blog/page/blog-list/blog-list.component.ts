import { LoaderService } from '@shared/modules/loader/loader.service';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService } from '@core/services/blog/blog.service';
import { Blog } from '@core/model/blog/blog';
import { finalize, switchMap, delay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { BaseParams } from '@core/model/base-params';
@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit {

  @ViewChild('target') targetScrollTo: ElementRef;
  listBlog: Blog[];
  baseParams: BaseParams = new BaseParams(1, 6);
  total = 1;
  currentTag = '';
  constructor(
    private readonly blogService: BlogService,
    private readonly router: Router,
    private readonly loaderService: LoaderService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.pipe(
      switchMap(queryParams => {
        this.total = 0;

        if (queryParams.tags !== undefined) {
          this.currentTag = queryParams.tags;
          this.changeFilterParam('tags', queryParams.tags);
        }
        else {
          this.currentTag = '';
          this.baseParams.filters = this.baseParams.filters.filter(f => f.key !== 'tags');
        }

        this.loaderService.showLoader('filter-blog')
        return this.blogService.getAllBlog(this.baseParams)
      }),
    ).subscribe(res => {
      if (res.isSuccess) {
        this.listBlog = res.data.data;
        this.total = res.data.count;
      }
      this.loaderService.hideLoader('filter-blog');
    });

  }

  changeFilterParam(key: string, value: string) {
    const index = this.baseParams.filters.findIndex(f => f.key === key);
    if (index === -1) {
      this.baseParams.filters = [...this.baseParams.filters, { key: key, value: value }];
    }
    else {
      this.baseParams.filters[index].value = value;
    }
  }

  onQueryPageIndexChange(pageNumber: number) {
    this.baseParams.pageIndex = pageNumber;

    this.targetScrollTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.loaderService.showLoader('filter-blog')
    this.blogService.getAllBlog(this.baseParams).pipe(
      finalize(() => {
        this.loaderService.hideLoader('filter-blog');
      })
    ).subscribe((res) => {
      if (res.isSuccess) {
        this.listBlog = res.data.data;
        this.total = res.data.count;
      }
    });
  }

  viewDetail(id: number) {
    this.router.navigate(['/blog/detail/', id]);
  }
}
