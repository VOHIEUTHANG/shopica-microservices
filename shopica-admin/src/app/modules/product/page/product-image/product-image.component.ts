import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '@env';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ProductService } from '../../services/product.service';
import { AwsS3Service } from '@app/core/services/aws-s3/aws-s3.service';
import { Observable, map } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { ProductImage } from '../../model/product-image';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent implements OnInit {
  @Input() listImage: NzUploadFile[];
  @Output() listImageChange = new EventEmitter<NzUploadFile[]>();
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp';
  previewImage: string | undefined = '';
  previewVisible = false;
  productId: number = 0;
  constructor(
    private readonly productService: ProductService,
    private readonly awsS3Service: AwsS3Service,
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.productId) {
        this.productId = params.productId
      }
    });
  }

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };
  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const folderName = '/product-images/' + new Date().toISOString();
    this.awsS3Service.getPreSignedUrl(file.name, environment.awsFolder + folderName, file.type ?? this.contentTypeAccept).subscribe(
      res => {
        if (res.isSuccess) {
          this.awsS3Service.uploadFileToS3(res.data.uploadUrl, file as any).subscribe(() => {
            this.listImage = [
              ...this.listImage,
              {
                uid: '0',
                url: res.data.fileUrl,
                name: file.name,
              }];

            this.listImageChange.emit(this.listImage);
          });

          if (this.productId !== 0) {
            const productImage: ProductImage = {
              productId: this.productId,
              imageUrl: res.data.fileUrl
            };

            this.productService.addImage(productImage).subscribe(res => {
              if (!res.isSuccess) {
                this.messageService.create('error', res.errorMessage);
              }
            })
          }
        }
        else {
          this.messageService.create('error', res.errorMessage);
        }
      }
    )

    return false;
  };


  remove = (file: NzUploadFile): Observable<boolean> => {
    return this.productService.deleteImage(file.uid, file.url)
      .pipe(
        map(res => {
          if (!res.isSuccess) {
            this.messageService.error(res.errorMessage);
          }
          this.listImageChange.emit(this.listImage);

          return res.data;
        })
      )
  }


}
