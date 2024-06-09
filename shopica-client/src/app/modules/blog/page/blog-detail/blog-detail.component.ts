import { ShareService } from './../../../../core/services/share/share.service';
import { AuthService } from './../../../../core/services/auth/auth.service';
import { LoaderService } from '@shared/modules/loader/loader.service';
import { formatDistance } from 'date-fns';
import { Blog } from '@core/model/blog/blog';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment, CommentDocumentType } from '@core/model/comment/comment';
import { BlogService } from '@core/services/blog/blog.service';
import { finalize } from 'rxjs/operators';
import { CommentService } from '@core/services/comment/comment.service';
import { BaseParams } from '@core/model/base-params';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  blog: Blog;
  comments: Comment[] = [];
  isAuthenticated = false;

  constructor(
    private readonly blogService: BlogService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService,
    private readonly commentService: CommentService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getBlogById(params.blogId);
    });
  }

  getBlogById(id: number) {
    this.loaderService.showLoader('blog-detail');
    this.blogService.getBlogById(id).pipe(
      finalize(() => this.loaderService.hideLoader('blog-detail')))
      .subscribe((res) => {
        const data = res.data;
        this.blog = data;
        this.getComment();
      });
  }

  getComment() {
    this.commentService.getAllComment(new BaseParams(1, 50), CommentDocumentType.Blog.toString(), this.blog.id)
      .subscribe(res => {
        if (res.isSuccess) {
          this.comments = res.data.data;
        }
      })
  }

}
