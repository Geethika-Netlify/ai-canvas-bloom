
export interface ChatMessage {
  id: number;
  content: string;
  sender: 'user' | 'ai';
}
