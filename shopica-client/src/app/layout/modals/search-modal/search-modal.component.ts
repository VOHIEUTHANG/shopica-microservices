import { LoaderService } from './../../../shared/modules/loader/loader.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Product } from '@core/model/product/product';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '@core/services/product/product.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { Observable, Observer, of } from 'rxjs';
import { getBase64 } from '@core/helper/form';
import { environment } from '@env';
import { BaseParams } from '@core/model/base-params';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})
export class SearchModalComponent implements OnInit {

  @Input() isVisible;
  @Output() closeSearchModalEvent = new EventEmitter();
  searchForm: UntypedFormGroup;
  baseParam: BaseParams = new BaseParams(1, 12);
  keyword: string = '';
  avatarUrl?: string;
  listProduct: Product[] = [];
  imgAnalyzer: string = "https://ec2-18-141-185-211.ap-southeast-1.compute.amazonaws.com/api/image-analyzer";
  // imgAnalyzer: string = `${environment.productServiceUrl}/api/upload`;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly productService: ProductService,
    private readonly router: Router,
    private msg: NzMessageService,
    private readonly loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.searchForm.controls.keyword.valueChanges.pipe(
      filter((value) => {
        value = value?.trim();
        this.keyword = value;
        if (value) {
          this.loaderService.showLoader('search');
          this.avatarUrl = '';
          return value;
        }
        else {
          this.listProduct = [];
        }
      }),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(keywords => {
        this.baseParam.filters = this.baseParam.filters.filter(f => f.key !== 'productName');

        if (keywords !== '') {
          this.baseParam.filters.push({ key: 'productName', value: keywords });
        }
        return this.productService.getListProduct(this.baseParam)
      })
    ).subscribe(res => {
      if (res.isSuccess) {
        this.listProduct = res.data.data;
      }
      this.loaderService.hideLoader('search');
    })
  }

  buildForm() {
    this.searchForm = this.formBuilder.group({
      keyword: [''],
    });
  }

  handleCancel() {
    this.clearProducts();
    this.clearSearchText();
    this.clearImage();
    this.closeSearchModalEvent.emit();
  }

  clearProducts() {
    this.listProduct = [];
  }

  clearSearchText() {
    this.searchForm.reset();
    this.keyword = '';
  }

  clearImage() {
    this.avatarUrl = '';
  }

  removeImageSearch() {
    this.clearImage();
    this.clearProducts();
    this.clearSearchText();

  }

  searchProductFullText(keywords: string[]) {
    this.keyword = keywords[0];
    this.loaderService.showLoader('search');
    this.productService.getListProduct(this.baseParam)
      .pipe(
        finalize(() => this.loaderService.hideLoader('search'))
      )
      .subscribe((res) => {
        if (res.isSuccess) {
          this.listProduct = res.data.data;
        }
      });
  }

  getBackgroundStyle(imageUrl: string) {
    return { 'background-image': 'url("' + imageUrl + '")' };
  }

  viewDetail(id: number) {
    this.handleCancel();
    this.router.navigate(['/product/detail/', id]);
  }

  handleChange(info: NzUploadChangeParam): void {
    let id: string;
    if (info.file.status === 'uploading' && info.type === 'start') {
      id = this.msg.loading('Image is loading..', { nzDuration: 0 }).messageId;
    }
    else if (info.file.status === 'done') {
      this.msg.remove(id);
      this.msg.success(`${info.file.name} file uploaded successfully`);
      this.clearSearchText();
      this.searchProductFullText(info.file.response.data);
      getBase64(info.file!.originFileObj!, (img: string) => {
        this.avatarUrl = img;
      });
    }
    else if (info.file.status === 'error') {
      this.msg.remove(id);
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng);
      observer.complete();
    });
  };
}
