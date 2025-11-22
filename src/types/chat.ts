export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'data' | 'tool';
  content: string;
  createdAt?: Date;
}
