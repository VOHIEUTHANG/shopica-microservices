import { Title } from '@angular/platform-browser';
import { LoaderService } from './shared/modules/loader/loader.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Component, ViewChild, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SignalrService } from '@core/services/signalr/signalr.service';
import { Notify } from '@core/model/notifies/notify';
import { ModalService } from '@core/services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('preload', { static: true }) loadElement: ElementRef;
  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;

  isLoaded = false;
  constructor(
    private router: Router,
    private readonly loaderService: LoaderService,
    private titleService: Title,
    private notification: NzNotificationService,
    private readonly signalrService: SignalrService,
    private readonly modalService: ModalService
  ) { }
  ngOnInit(): void {
    this.signalrService.buildNotifyConnection();
    this.signalrService.startNotifyConnection();
    this.signalrService.addNotifyDataListener();

    document.getElementById('preload').className = 'preload-none';

    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.loaderService.showLoader();
        }
        else if (event instanceof NavigationEnd) {
          const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
          this.titleService.setTitle(`${title} | Shopica`);
          this.loaderService.hideLoader();
        }
      },
      error => {
        this.loaderService.hideLoader();
      });

    this.signalrService.notifyEventEmitter$.subscribe(data => {
      this.createNotification(data);
    })
  }

  createNotification(data: Notify): void {
    const product = {
      productId: data.sourceDocumentId,
      productName: data.content,
      imageUrl: data.attribute1
    };


    this.notification.template(this.template!, { nzData: product, nzPlacement: 'bottomLeft' });
  }

  viewProductDetail(id: number) {
    this.modalService.closeCartDrawerEvent();
    this.modalService.closeQuickShopEvent();
    this.modalService.closeQuickViewEvent();
    this.router.navigate(['/product/detail', id]);
  }




  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

}
