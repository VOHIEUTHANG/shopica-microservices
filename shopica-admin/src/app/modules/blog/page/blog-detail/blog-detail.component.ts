import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from '@env';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize, map } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { UtilitiesService } from '@app/core/services/utilities/utilities.service';
import { Observable } from 'rxjs';
import { AwsS3Service } from '@app/core/services/aws-s3/aws-s3.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../models/blog';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  baseForm: UntypedFormGroup;
  isLoadingButtonSubmit = false;
  avatarUrl?: string;
  tags: string[];
  isHaveFile = false;
  contentTypeAccept = 'image/png,image/jpeg,image/gif,image/bmp';
  fileList: NzUploadFile[] = [];
  blogId: number;

  constructor(
    private readonly blogService: BlogService,
    private readonly utilitiesService: UtilitiesService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly messageService: NzMessageService,
    private readonly awsS3Service: AwsS3Service,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getBlogTags();
    this.buildForm();

    this.activatedRoute.params.subscribe(params => {
      if (params.blogId) {
        this.blogId = params.blogId
        this.loadBlogById(this.blogId);
      }
    });
  }

  loadBlogById(blogId: number) {
    this.blogService.getBlogById(blogId).subscribe(res => {
      if (res.isSuccess) {
        const blog = res.data;
        this.baseForm.controls['title'].setValue(blog.title);
        this.baseForm.controls['content'].setValue(blog.content);
        this.baseForm.controls['summary'].setValue(blog.summary);
        this.baseForm.controls['tags'].setValue(blog.tags);

        this.fileList = [
          {
            uid: blog.id.toString(),
            url: blog.backgroundUrl,
            name: new URL(blog.backgroundUrl).pathname.split('/').pop(),
          }
        ]
      }
    })
  }

  buildForm() {
    this.baseForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      summary: [null, [Validators.required]],
      content: [null, [Validators.required]],
      backgroundUrl: [null],
      tags: [null, [Validators.required]]
    });
  }

  getBlogTags() {
    this.blogService.getBlogTags().subscribe((res) => {
      this.tags = res.data
    })
  }

  submitForm() {
    const blog: Blog = {
      title: this.baseForm.get('title').value,
      authorName: this.utilitiesService.getUserName(),
      content: this.baseForm.get('content').value,
      summary: this.baseForm.get('summary').value,
      tags: this.baseForm.get('tags').value,
      backgroundUrl: this.fileList[0].url,
    }

    if (this.blogId != undefined) {
      blog.id = this.blogId;
      this.updateBlog(blog);
    }
    else {
      this.addBlog(blog);
    }

    this.isLoadingButtonSubmit = true;

  }

  addBlog(blog: Blog) {
    this.blogService.create(blog)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Create blog successfully!`);
          this.router.navigate(['/admin/blog']);
        }
      });
  }

  updateBlog(blog: Blog) {
    this.blogService.update(blog)
      .pipe(finalize(() => (this.isLoadingButtonSubmit = false)))
      .subscribe((res) => {
        if (res.isSuccess) {
          this.messageService.create('success', `Update blog successfully!`);
          this.router.navigate(['/admin/blog']);
        }
      });
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const folderName = '/blog-images/' + new Date().toISOString();
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

}
