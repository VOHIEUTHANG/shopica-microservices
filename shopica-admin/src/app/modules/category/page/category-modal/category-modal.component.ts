import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { environment } from '@env';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize, map } from 'rxjs/operators';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { AwsS3Service } from '@app/core/services/aws-s3/aws-s3.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css'],
})
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() category!: Category;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<Category>();
  @Output() updateSuccessEvent = new EventEmitter<Category>();
  isHaveFile = false;
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp';
  fileList: NzUploadFile[] = [];

  baseForm: FormGroup;
  isLoadingButton = false;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly messageService: NzMessageService,
    private readonly awsS3Service: AwsS3Service
  ) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      categoryName: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] != undefined && changes['category'].currentValue != undefined) {
      this.baseForm.controls['categoryName'].setValue(changes['category'].currentValue.categoryName);
      this.isHaveFile = true;
      this.fileList = [{
        uid: new URL(changes['category'].currentValue.imageUrl).pathname,
        url: changes['category'].currentValue.imageUrl,
        name: new URL(changes['category'].currentValue.imageUrl).pathname.split('/').pop(),
      }];
    }
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
    this.fileList = [];
  }

  submitForm() {
    const request: Category = {
      categoryName: this.baseForm.controls["categoryName"].value,
      imageUrl: this.fileList[0].url,
    }

    if (this.isEditMode) {
      request.id = this.category.id;
      this.updateCategory(request);
    }
    else {
      this.addCategory(request);
    }

  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const folderName = '/category-images/' + new Date().toISOString();
    this.awsS3Service.getPreSignedUrl(file.name, environment.awsFolder + folderName, file.type ?? this.contentTypeAccept).subscribe(
      res => {
        if (res.isSuccess) {
          this.awsS3Service.uploadFileToS3(res.data.uploadUrl, file as any)
            .pipe(
          ).subscribe(() => {
            this.isHaveFile = true;
            this.fileList = [{
              uid: res.data.awsFileKey,
              url: res.data.fileUrl,
              name: file.name,
            }];

            this.messageService.success('upload successfully.');
          });
        }
        else {
          this.messageService.create('error', res.errorMessage);
        }
      }
    )

    return false;
  };


  remove = (file: NzUploadFile): Observable<boolean> => {
    return this.awsS3Service.delete(file.uid)
      .pipe(
        map(res => {
          if (!res.isSuccess) {
            this.messageService.error(res.errorMessage);
          }
          return res.data;
        })
      )
  }

  addCategory(category: Category) {
    this.categoryService.create(category)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create category successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
          this.fileList = [];
        }
      });
  }

  updateCategory(category: Category) {
    this.categoryService.update(category)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update category successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
          this.fileList = [];

        }
      });
  }

}
