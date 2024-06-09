import { OrderDetailResponse } from './../../../../core/model/order/order-detail-response';
import { LoaderService } from './../../../../shared/modules/loader/loader.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CheckoutService } from '@core/services/checkout/checkout.service';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Order, OrderStatus } from '@core/model/order/order';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  public orderStatus = OrderStatus;
  isLoading = false;
  isOpenReviewModal = false;
  orderDetail: OrderDetailResponse;
  @ViewChild('screen') screen: ElementRef;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly checkoutService: CheckoutService,
    private readonly loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.loaderService.showLoader('order-detail');
    this.activatedRoute.params.pipe(
      switchMap(params => {
        return this.checkoutService.getOrderDetailById(params.id);
      })
    ).subscribe(res => {
      if (res.isSuccess) {
        this.order = res.data;
      }
      this.isLoading = false;
      this.loaderService.hideLoader('order-detail');
    });
  }


  downLoadInvoice() {
    const pdf = new jsPDF('p', 'pt', 'a4');
    html2canvas(this.screen.nativeElement, {
      width: 800,
      height: 1000,
    }).then(canvas => {
      let base64 = canvas.toDataURL('image/png');
      pdf.addImage(base64, 'png', 40, 40, 515, 600);
      pdf.save(`invoice(${this.order.id}).pdf`);
    });
  }

  openReviewModal(orderDetail: OrderDetailResponse) {
    this.orderDetail = orderDetail;
    this.isOpenReviewModal = true;
  }
}
