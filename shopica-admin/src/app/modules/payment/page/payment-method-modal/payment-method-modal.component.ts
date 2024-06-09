import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PaymentMethod } from '../../models/payment-method';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AwsS3Service } from '@app/core/services/aws-s3/aws-s3.service';
import { environment } from '@env';
import { Observable, finalize, map } from 'rxjs';

@Component({
  selector: 'app-payment-method-modal',
  templateUrl: './payment-method-modal.component.html',
  styleUrl: './payment-method-modal.component.css'
})
export class PaymentMethodModalComponent {
  @Input() isVisible = false;
  @Input() modalTitle!: string;
  @Input() paymentMethod!: PaymentMethod;
  @Input() isEditMode: boolean = false;
  @Output() cancelEvent = new EventEmitter<string>();
  @Output() insertSuccessEvent = new EventEmitter<PaymentMethod>();
  @Output() updateSuccessEvent = new EventEmitter<PaymentMethod>();
  isHaveFile = false;
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp,image/svg+xml';
  fileList: NzUploadFile[] = [];

  baseForm: FormGroup;
  isLoadingButton = false;

  constructor(
    private readonly paymentMethodService: PaymentService,
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
      name: [null, Validators.required],
      description: [null, Validators.required],
      active: [null, Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentMethod'] != undefined && changes['paymentMethod'].currentValue != undefined) {
      this.baseForm.controls['name'].setValue(changes['paymentMethod'].currentValue.name);
      this.baseForm.controls['description'].setValue(changes['paymentMethod'].currentValue.description);
      this.baseForm.controls['active'].setValue(changes['paymentMethod'].currentValue.active);
      this.isHaveFile = true;
      this.fileList = [{
        uid: new URL(changes['paymentMethod'].currentValue.imageUrl).pathname,
        url: changes['paymentMethod'].currentValue.imageUrl,
        name: new URL(changes['paymentMethod'].currentValue.imageUrl).pathname.split('/').pop(),
      }];
    }
  }

  cancelModal(): void {
    this.cancelEvent.emit();
    this.baseForm.reset();
    this.fileList = [];
  }

  submitForm() {
    const request: PaymentMethod = {
      name: this.baseForm.controls["name"].value,
      description: this.baseForm.controls["description"].value,
      active: this.baseForm.controls["active"].value,
      imageUrl: this.fileList[0].url,
    }

    if (this.isEditMode) {
      request.id = this.paymentMethod.id;
      this.updatePaymentMethod(request);
    }
    else {
      this.addPaymentMethod(request);
    }

  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const folderName = '/payment-method-images/' + new Date().toISOString();
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

  addPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethodService.create(paymentMethod)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create paymentMethod successfully!`);
          this.insertSuccessEvent.emit(res.data);
          this.baseForm.reset();
          this.fileList = [];
        }
      });
  }

  updatePaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethodService.update(paymentMethod)
      .pipe(
        finalize(() => (this.isLoadingButton = false))
      ).subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update paymentMethod successfully!`);
          this.updateSuccessEvent.emit(res.data);
          this.baseForm.reset();
          this.fileList = [];

        }
      });
  }
}
