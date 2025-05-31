interface MessageRequest {
  content: string;
}

interface MessageResponse {
  id: number;
  sender: string;
  content: string;
  sentAt: string;
}

interface ConversationResponse {
  id: number;
  startedAt: string;
  messages: MessageResponse[];
}

export type { MessageRequest, MessageResponse, ConversationResponse };  
