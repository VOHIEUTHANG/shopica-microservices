import { ActivatedRoute } from '@angular/router';
import { ShareService } from './../../../core/services/share/share.service';
import { formatDistance } from 'date-fns';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Comment } from '@core/model/comment/comment';
import { CommentService } from '@core/services/comment/comment.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@env';
import { JwtService } from '@core/services/jwt/jwt.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() comments: Comment[];
  @ViewChild('target') targetScrollTo: ElementRef;
  isProductComment: boolean;
  pageSize = 3;
  pageIndex = 1;
  customerImage: string;
  showComments: Comment[] = [];

  currentData: Comment[] = [];

  isAuthenticated = false;
  constructor(
    private readonly authService: AuthService,
    private readonly shareService: ShareService,
    private readonly activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.shareService.authenticateSourceEmitted$.subscribe(isLogin => {
      this.isAuthenticated = isLogin;
    })

    this.activatedRoute.params.subscribe(params => {
      if (params.productId) {
        this.isProductComment = true;
      }
    })

    this.isAuthenticated = this.authService.isAuthenticated();

    this.shareService.customerInfoEmitted$.subscribe(data => {
      if (data) {
        this.customerImage = data.imageUrl;
      }

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comments.currentValue) {
      this.currentData = changes.comments.currentValue;
      this.loadCurrentComments();
    }
  }

  loadCurrentComments() {
    this.showComments = this.currentData.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
  }

  addNewComment(comment: Comment) {
    this.comments = [
      comment,
      ...this.comments
    ]
    this.currentData = this.comments;
    this.loadCurrentComments();
  }

  deleteComment(id: number) {
    this.comments = this.comments.filter(item => item.id != id);
    this.currentData = this.comments;
    this.loadCurrentComments();
  }

  onQueryPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.targetScrollTo.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
    this.loadCurrentComments();
  }

  filterByRating(ratings: string[]) {
    if (ratings.indexOf('desc') !== -1) {
      this.currentData = this.comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    else {
      this.currentData = this.comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    if (ratings.length == 1 && ratings.indexOf('desc') !== -1 || ratings.length == 0) {
      this.currentData = this.comments;
    }
    else {
      this.currentData = this.comments.filter(x => ratings.indexOf(x.rate.toString()) !== -1)
    }
    this.loadCurrentComments();
  }
}
