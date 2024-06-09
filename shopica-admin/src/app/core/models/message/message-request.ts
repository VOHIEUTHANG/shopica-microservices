import { Attachment } from './attachment';
export interface MessageRequest {
  content: string;
  senderName: string;
  senderImage: string;
  conversation_id: number;
  sender_id: number;
  receive_id: number;
  attachments?: Attachment[];
}
