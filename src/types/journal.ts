export interface JournalEntryRequest {
  title: string;
  content: string;
  mood?: string;
}

export interface JournalEntryResponse {
  id: number;
  title: string;
  content: string;
  mood?: string;
  createdAt: string;
  updatedAt: string;
}
