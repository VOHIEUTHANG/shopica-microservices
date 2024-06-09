import { ModalService } from './../../../../../core/services/modal/modal.service';
import { ShareService } from '@core/services/share/share.service';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from './../../../../../core/services/auth/auth.service';
import { CommentService } from './../../../../../core/services/comment/comment.service';
import { JwtService } from './../../../../../core/services/jwt/jwt.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Comment } from '@core/model/comment/comment';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() comment: Comment;
  @Output() deleteCommentEvent = new EventEmitter<number>();
  accountId: number;
  isShowEditInput = false;
  isProductComment = false;
  currentLike: number;
  beginLike: number;
  constructor(
    private readonly jwtService: JwtService,
    private readonly commentService: CommentService,
    private readonly authService: AuthService,
    private readonly messageService: NzMessageService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params.productId) {
        this.isProductComment = true;
      }
    })
    this.accountId = this.jwtService.getUserId();
    // this.commentService.checkInteractive(this.comment.id).subscribe(res => {
    //   this.beginLike = res.data.liked ? 1 : (res.data.disliked ? -1 : 0);
    //   this.currentLike = this.beginLike;
    // });
  }

  showEdit() {
    this.isShowEditInput = true;
  }

  editComment(comment: Comment) {
    this.comment.content = comment.content;
    this.isShowEditInput = false;
  }

  delete(id: number) {
    this.deleteCommentEvent.emit(id);
    this.commentService.deleteComment(id).subscribe((res) => {
    });
  }

  updateLike(id: number, status: boolean) {
    if (!this.authService.isAuthenticated()) {
      this.modalService.openLoginDrawerEvent();
      return;
    }

    if (this.currentLike === 1) {
      // this.comment.like--;
      if (!status) {
        // this.comment.dislike++;
        this.currentLike = -1;
      }
      else {
        this.currentLike = 0;
      }
    }
    else if (this.currentLike === -1) {
      // this.comment.dislike--;
      if (status) {
        // this.comment.like++;
        this.currentLike = 1;
      }
      else {
        this.currentLike = 0;
      }
    }
    else {
      if (status) {
        // this.comment.like++;
        this.currentLike = 1
      }
      else {
        // this.comment.dislike++;
        this.currentLike = -1;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.beginLike !== this.currentLike) {
      if (this.currentLike === 0) {
        this.commentService.likeComment(this.comment.id, this.beginLike === 1).subscribe(res => {
        });
      }
      else {
        this.commentService.likeComment(this.comment.id, this.currentLike === 1).subscribe(res => {
        });
      }
    }
  }



  // private updateLikeForComment(id: number, isLike: boolean) {
  //   this.commentService.likeComment(id, isLike).subscribe((res) => {
  //   });
  // }

  // private hasLogin() {
  //   if (!this.authService.isAuthenticated()) {
  //     this.modalService.openLoginDrawerEvent();
  //     return false;
  //   }
  //   return true;
  // }

  // async dislike(id: number) {
  //   if (!this.authService.isAuthenticated()) {
  //     this.modalService.openLoginDrawerEvent();
  //     return;
  //   }
  //   const res = await this.commentService.checkInteractive(id);
  //   const liked = res["data"]["liked"];
  //   const disliked = res["data"]["disliked"];
  //   if (this.hasLogin()) {
  //     this.updateLikeForComment(id, false);
  //     if (!disliked) {
  //       this.comment.dislike++;
  //     } else {
  //       this.comment.dislike--;
  //     }
  //     if (liked) {
  //       this.comment.like--;
  //     }
  //   }
  // }

}
