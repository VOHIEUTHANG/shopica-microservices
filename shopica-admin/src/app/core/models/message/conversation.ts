import { Message } from "./message";

export interface Conversation {
  id: number;
  conversationTitle: string;
  conversationImage: string;
  created_at: Date;
  receive_id: number;
  lastMessage: Message;
}
