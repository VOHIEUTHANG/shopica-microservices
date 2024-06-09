import { Attachment } from './attachment';
export interface Message {
  id: string;
  content: string;
  created_at: Date;
  conversation_id?: number;
  sender_id: number;
  isRead?: boolean;
  attachments?: Attachment[];
}
