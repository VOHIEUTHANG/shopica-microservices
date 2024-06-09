import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { CommentService } from '@core/services/comment/comment.service';
import { OrderDetailResponse } from './../../../../core/model/order/order-detail-response';
import { Product } from '@core/model/product/product';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment, CommentDocumentType } from '@core/model/comment/comment';
import { JwtService } from '@core/services/jwt/jwt.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  @Input() orderDetail: OrderDetailResponse;
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  reviewForm: UntypedFormGroup;
  isLoading = false;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly commentService: CommentService,
    private readonly messageService: NzMessageService,
    private readonly jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.reviewForm = this.formBuilder.group({
      content: [null, Validators.required],
      rate: [0, Validators.required]
    })
  }

  handleCancel() {
    this.isVisibleChange.emit(false);
  }

  sendReview() {
    const request: Comment = {
      documentId: this.orderDetail.productId,
      documentType: CommentDocumentType.Product,
      customerId: this.jwtService.getUserId(),
      customerImageUrl: this.jwtService.getImageUrl(),
      customerName: this.jwtService.getName(),
      email: this.jwtService.getEmail(),
      content: this.reviewForm.controls['content'].value,
      rate: this.reviewForm.controls['rate'].value,
    }

    this.isLoading = true;
    this.commentService.sendComment(request).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((res) => {
      if (res.isSuccess) {
        this.isVisibleChange.emit(false);
        this.messageService.success('Add review successfully!');
      }
    });
  }

}
