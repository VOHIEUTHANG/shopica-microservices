import { ActivatedRoute } from '@angular/router';
import { CommentService } from './../../../../../core/services/comment/comment.service';
import { finalize } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Comment, CommentDocumentType } from '@core/model/comment/comment';
import { JwtService } from '@core/services/jwt/jwt.service';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent implements OnInit, OnChanges {

  isLoading = false;
  blogId: number;
  @Input() content: string;
  @Input() comment: Comment;
  @Output() addNewCommentEvent = new EventEmitter<Comment>();
  @Output() editCommentEvent = new EventEmitter<Comment>();
  constructor(
    private readonly commentService: CommentService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly jwtService: JwtService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.comment !== undefined && changes.comment.currentValue !== undefined) {
      this.content = changes.comment.currentValue.content;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.blogId = params.blogId;
    });
  }

  commentChange() {
    this.isLoading = true;
    this.comment ? this.editComment() : this.addComment();
  }

  addComment() {
    const request: Comment = {
      content: this.content,
      documentId: this.blogId,
      documentType: CommentDocumentType.Blog,
      customerId: this.jwtService.getUserId(),
      customerImageUrl: this.jwtService.getImageUrl(),
      customerName: this.jwtService.getName(),
      email: this.jwtService.getEmail(),
      rate: 0,
    }

    this.commentService.sendComment(request).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((res) => {
      if (res.isSuccess) {
        this.content = '';
        this.addNewCommentEvent.emit(res.data);
      }
    });
  }

  editComment() {
    const request: Comment = {
      id: this.comment.id,
      content: this.content,
      documentId: this.comment.documentId,
      documentType: CommentDocumentType.Blog,
      customerId: this.jwtService.getUserId(),
      customerImageUrl: this.jwtService.getImageUrl(),
      customerName: this.jwtService.getName(),
      email: this.jwtService.getEmail(),
      rate: this.comment.rate,
    }

    this.commentService.editComment(request).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((res) => {
      if (res.isSuccess) {
        this.editCommentEvent.emit(res.data);
      }
    });
  }

}
