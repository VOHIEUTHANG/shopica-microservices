export interface Blog {
  id?: number;
  title: string;
  content: string;
  summary: string;
  backgroundUrl: string;
  tags: string;
  authorName: string;
  createdAt?: string;
}
