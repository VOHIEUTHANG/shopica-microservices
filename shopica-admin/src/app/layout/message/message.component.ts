import { Attachment } from './../../core/models/message/attachment';
import { environment } from '@env';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fileMineTypes } from './../../core/models/message/file-type';
import { NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { ProfileService } from '@modules/profile/services/profile.service';
import { SignalrService } from '@core/services/signalr/signalr.service';
import { UtilitiesService } from './../../core/services/utilities/utilities.service';
import { MessageRequest } from './../../core/models/message/message-request';
import { Component, OnInit, ElementRef, ViewChild, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Conversation } from '@app/core/models/message/conversation';
import { Message } from '@app/core/models/message/message';
import { MessageService } from '@core/services/message/message.service';
import { Observer, Observable } from 'rxjs';
import { convertToLocalTime } from '@app/core/models/message/time-helper';
import { NzImage, NzImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
  uploadUrl = `${environment.gatewayServiceUrl}/api/upload`;
  isShowMessagesFrame = false;
  accountId: number = -1;
  content: string;
  storeName: string;
  isLoad = true;
  isLoading = false;
  numMessageUnRead: number;
  conversationSelected: Conversation;
  conversations: Conversation[] = [];
  messages: Message[] = [];
  fileList: NzUploadFile[] = [];
  @ViewChild('messageContent') messageContent: ElementRef;
  @ViewChild('audioElement', { static: true }) private audioElement;

  constructor(
    private readonly messageService: MessageService,
    private readonly utilitiesService: UtilitiesService,
    private readonly signalrService: SignalrService,
    private readonly renderer: Renderer2,
    private readonly profileService: ProfileService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly nzMessageService: NzMessageService,
    private readonly nzImageService: NzImageService
  ) { }

  ngOnInit() {
    this.accountId = this.utilitiesService.getUserId();


    // this.loadSellerInfo();
    // this.getConversations();
    // this.receiveMessage();

    // this.messageService.conversationEmitted$.subscribe(conversation => {
    //   const existConversations = this.conversations.filter(x => x.id === conversation.id);
    //   if (existConversations.length == 0) {
    //     this.conversations.unshift(conversation);
    //     this.conversationSelected = conversation;
    //   }
    //   else {
    //     this.conversationSelected = existConversations[0];
    //   }
    //   this.openConversation(this.conversationSelected);
    //   this.isShowMessagesFrame = true;

    // })
  }

  loadSellerInfo() {
    const storeId = this.utilitiesService.getStoreId();
  }

  // receiveMessage() {
  //   this.signalrService.messageEventEmitter$.subscribe(conversation => {
  //     if (conversation.id == this.conversationSelected.id) {
  //       this.messages.push(conversation.lastMessage);
  //     }

  //     const index = this.conversations.findIndex(x => x.id == conversation.id);
  //     if (index !== -1) {

  //       this.conversations[index].lastMessage = conversation.lastMessage;
  //       this.conversations = [
  //         this.conversations[index],
  //         ...this.conversations.filter(x => x.id !== conversation.id)
  //       ]
  //     }
  //     else {
  //       this.conversations.unshift(conversation);
  //     }
  //     this.calculateMessageUnRead();
  //     this.playNotifySound();
  //     this.changeDetector.detectChanges();
  //     this.scrollToBottom();
  //   })
  // }

  getConversations() {
    this.messageService.getAllConversations(this.accountId).subscribe(res => {
      if (res.isSuccess) {
        this.conversations = res.data;

        this.conversations.map(c => {
          c.created_at = convertToLocalTime(c.created_at);
          if (c.lastMessage) {
            c.lastMessage.created_at = convertToLocalTime(c.lastMessage.created_at);
          }
          return c;
        });

        if (this.conversations.length > 0) {
          this.conversationSelected = this.conversations[0];
          this.openConversation(this.conversationSelected);
          this.changeDetector.detectChanges();
        }
      }
    })
  }

  calculateMessageUnRead() {
    this.numMessageUnRead = this.conversations.filter(x => x.lastMessage && x.lastMessage.sender_id != this.accountId && !x.lastMessage.isRead).length;
  }

  openConversation(conversation: Conversation) {
    this.fileList = [];
    this.messages = [];
    this.isLoading = true;
    this.messageService.getMessageByConversation(conversation?.id).subscribe(res => {
      if (res.isSuccess) {
        this.messages = res.data;
        this.isLoading = false;
        this.changeDetector.detectChanges();
        this.scrollToBottom();
      }
    })

    this.conversationSelected = {
      ...conversation
    };

    if (this.conversationSelected.lastMessage) {
      this.messageService.readMessage(conversation.id).subscribe(res => {
        this.conversationSelected.lastMessage.isRead = true;
        this.calculateMessageUnRead();
        this.changeDetector.detectChanges();
      });
    }
  }

  sendMessage() {
    const attachments: Attachment[] = [];
    if ((this.content === undefined || this.content === '') && this.fileList.length === 0) {
      return;
    }

    if (!this.isLoad) {
      return;
    }

    this.fileList.forEach(file => {
      const fileType = fileMineTypes.filter(x => x.mimeType.includes(file.type));
      if (fileType[0]?.name == 'IMAGE') {
        attachments.push({
          thumbUrl: file.response?.data[0]
        })
      }
      else {
        attachments.push({
          fileUrl: file.response?.data[0],
          name: file.name
        })
      }
    })

    const messageRequest: MessageRequest = {
      content: this.content,
      senderImage: this.utilitiesService.getImage(),
      senderName: this.storeName,
      conversation_id: this.conversationSelected?.id,
      sender_id: this.accountId,
      receive_id: this.conversationSelected?.receive_id,
      attachments: attachments
    }

    this.messageService.sendMessage(messageRequest).subscribe(res => {
      if (res.isSuccess) {
        const message = {
          id: res.data,
          content: this.content,
          created_at: new Date(),
          sender_id: this.accountId,
          isRead: true,
          attachments: attachments
        };
        this.messages.push(message)

        this.content = "";
        this.fileList = [];
        const index = this.conversations.findIndex(x => x.id == this.conversationSelected.id);
        this.conversations[index].lastMessage = message;
        this.conversations = [
          this.conversations[index],
          ...this.conversations.filter(x => x.id !== this.conversationSelected.id)
        ]
        this.changeDetector.detectChanges();
        this.scrollToBottom();
      }

    })
  }

  previewImage(imageUrl: string) {
    let listNzImages: NzImage[] = [];
    listNzImages.push({
      src: imageUrl
    });

    this.nzImageService.preview(listNzImages, { nzZoom: 1, nzRotate: 0 })
  }

  removeAttachment(id: string) {
    this.fileList = this.fileList.filter(x => x.uid !== id);
  }

  handleChange = (info: NzUploadChangeParam) => {
    this.isLoad = false;
    if (info.type == 'success') {
      this.isLoad = true;
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isSmall2M = file.size! / 1024 / 1024 < 1;
      if (!isSmall2M) {
        this.nzMessageService.error('File must smaller than 1MB!');
        observer.complete();
        return;
      }
      const fileType = fileMineTypes.filter(x => x.mimeType.includes(file.type));
      file.color = fileType.length > 0 ? fileType[0].colorCode : fileMineTypes[0].colorCode;
      file.extension = file.name.split('.').pop().toLocaleUpperCase();
      file.newSize = file.size / 1024 < 1 ? `${file.size} B` : `${Math.round(file.size / 1024)} KB`;
      observer.next(isSmall2M);
      observer.complete();
    });
  };

  scrollToBottom(): void {
    this.messageContent.nativeElement.scrollTop = this.messageContent.nativeElement.scrollHeight;
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

}
