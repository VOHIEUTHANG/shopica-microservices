import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductSort } from '@core/model/product/product-sort';
import { Sort } from '@core/model/sort';

@Component({
  selector: 'app-toolbars',
  templateUrl: './toolbars.component.html',
  styleUrls: ['./toolbars.component.css']
})
export class ToolbarsComponent implements OnInit {
  numOnePage = 4;
  prevWidth = window.innerWidth;
  @Output() openFilterDrawerEvent = new EventEmitter<boolean>();
  @Output() changeNumberProductEvent = new EventEmitter<number>();
  selectedSort: string;
  public productSortIds = Object.values(ProductSort).filter(value => typeof value === 'string');
  currentCategory: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.prevWidth > 992 && event.target.innerWidth <= 992) {
      this.viewProduct(2);
    }
    else if (this.prevWidth < 992 && event.target.innerWidth > 992) {
      this.viewProduct(4);
    }
    this.prevWidth = event.target.innerWidth;
  }
  constructor(private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.currentCategory = data.category;
    });

    this.activatedRoute.queryParams.subscribe((data) => {
      this.selectedSort = this.getSelectedSort(data.sortField, data.sortOrder);
    });
  }

  getSelectedSort(sortField: string, sortOrder: string) {
    if (sortField == 'price') {
      if (sortOrder == 'ascend') return ProductSort.LOW_HIGH;
      else return ProductSort.HIGH_LOW;
    }
    if (sortField == 'productName') {
      if (sortOrder == 'ascend') return ProductSort.A_Z;
      else return ProductSort.Z_A;
    }
    if (sortField == 'createdAt') {
      if (sortOrder == 'ascend') return ProductSort.OLD_NEW;
      else return ProductSort.NEW_OLD;
    }
  }


  openFilterDrawer() {
    this.openFilterDrawerEvent.emit();
  }

  viewProduct(numProductOnePage: number) {
    this.numOnePage = numProductOnePage;
    this.changeNumberProductEvent.emit(numProductOnePage);
  }

  sortChange(value: string): void {
    switch (value) {
      case ProductSort.LOW_HIGH:
        this.setQueryParams('price', 'ascend');
        break;
      case ProductSort.HIGH_LOW:
        this.setQueryParams('price', 'descend');
        break;
      case ProductSort.A_Z:
        this.setQueryParams('productName', 'ascend');
        break;
      case ProductSort.Z_A:
        this.setQueryParams('productName', 'descend');
        break;
      case ProductSort.NEW_OLD:
        this.setQueryParams('createdAt', 'descend');
        break;
      case ProductSort.OLD_NEW:
        this.setQueryParams('createdAt', 'ascend');
        break;
      default:
        break;
    }
  }

  setQueryParams(sortField: string, sortOrder: string) {
    this.router.navigate(['/product/collection', this.currentCategory],
      {
        queryParams: {
          sortField: sortField,
          sortOrder: sortOrder
        }, queryParamsHandling: 'merge'
      });
  }
}
