import { Comment } from '../comment/comment';

export interface Blog {
  id: number;
  summary: string;
  title: string;
  authorName: string;
  createdAt: Date;
  content: string;
  backgroundUrl: string;
}
