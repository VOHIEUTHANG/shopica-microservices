import { UtilitiesService } from './../../core/services/utilities/utilities.service';
import { NavigationStart, Router } from '@angular/router';
import { environment } from '@env';
import { StorageService } from '@core/services/storage/storage.service';
import { NotifyService } from '@core/services/notify/notify.service';
import { SignalrService } from '@core/services/signalr/signalr.service';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NotificationSourceEvent, Notify } from '@app/models/notifies/notify';
import { ProfileService } from '@app/modules/profile/services/profile.service';
import { BaseParams } from '@app/modules/common/base-params';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  username: string;
  userImage: string;
  @ViewChild('audioElement', { static: true }) private audioElement;
  listNotify: Notify[] = [];
  numUnRead = 0;
  isHomePage: boolean;

  constructor(
    private readonly signalrService: SignalrService,
    private readonly renderer: Renderer2,
    private readonly notifyService: NotifyService,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly utilitiesService: UtilitiesService,
    private readonly profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.notifyService.getAllNotify(new BaseParams(1, 10), NotificationSourceEvent.OrderCreated.toString()).subscribe(res => {
      if (res.isSuccess) {
        this.listNotify = res.data.data;
        this.numUnRead = this.listNotify.filter(x => !x.isRead).length;
      }
    })

    this.signalrService.notifyEventEmitter$.subscribe(data => {
      this.listNotify.unshift(data);
      this.numUnRead++;
      this.playNotifySound();
    })

    this.username = this.utilitiesService.getName();
    this.userImage = this.utilitiesService.getImage();

    this.profileService.currentUser.subscribe(user => {
      this.username = user.username;
      this.userImage = user.imageUrl;
    })

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.isHomePage = event.url == '/admin';
      }
    }
    );
  }

  updateReadNotification() {
    this.notifyService.updateReadNotification().subscribe(res => {
      if (res.isSuccess) {
        this.numUnRead = 0;
      }
    })
  }

  playNotifySound() {
    this.audioElement.nativeElement.insertAdjacentHTML("beforeend", "<audio autoplay><source src='assets/musics/notification.mp3'></audio>")
    setTimeout(() => {
      const childElements = this.audioElement.nativeElement.childNodes;
      for (let child of childElements) {
        this.renderer.removeChild(this.audioElement.nativeElement, child);
      }
    }, 1000)
  }

  logout() {
    this.storageService.remove(environment.tokenKey);
    this.router.navigate(['/auth/login']);
  }
}
