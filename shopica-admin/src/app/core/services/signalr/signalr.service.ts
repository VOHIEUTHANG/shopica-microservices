import { Conversation } from '@core/models/message/conversation';
import { UtilitiesService } from './../utilities/utilities.service';
import { Notify } from './../../../models/notifies/notify';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { Message } from '@app/core/models/message/message';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private notifyHubConnection: signalR.HubConnection
  // private chatHubConnection: signalR.HubConnection

  private notifySubject = new Subject<Notify>();

  // private messageSubject = new Subject<Conversation>();

  notifyEventEmitter$ = this.notifySubject.asObservable();
  // messageEventEmitter$ = this.messageSubject.asObservable();

  constructor(private readonly utilitiesService: UtilitiesService) { }

  public buildNotifyConnection() {
    this.notifyHubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.gatewayServiceUrl}/notifications`, { transport: signalR.HttpTransportType.LongPolling, accessTokenFactory: () => this.utilitiesService.getToken() })
      .withAutomaticReconnect()
      .build();
  }


  // public buildChatConnection() {
  //   this.chatHubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(`${environment.gatewayServiceUrl}/chatHub`, { accessTokenFactory: () => this.utilitiesService.getToken() })
  //     .withAutomaticReconnect()
  //     .build();
  // }

  public startNotifyConnection() {
    this.notifyHubConnection
      .start()
      .then(() => console.log("Start Notify Connection"))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  // public startChatConnection() {
  //   this.chatHubConnection
  //     .start()
  //     .then(() => console.log("Start Chat Connection"))
  //     .catch((err) => console.log('Error while starting connection: ' + err));
  // }

  public addNotifyDataListener = () => {
    this.notifyHubConnection.on('AdminNotificationCreatedMessage', (data) => {
      console.log(data);

      this.notifySubject.next(data);
    });
  }

  // public addReceiveMessageDataListener = () => {
  //   this.chatHubConnection.on('ReceiveMessage', (data) => {
  //     console.log(data);
  //     this.messageSubject.next(data);
  //   });
  // }
}
