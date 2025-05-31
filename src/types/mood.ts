interface MoodEntryRequest {
  date: string; // ISO date format
  mood: MoodType;
  notes?: string;
}

interface MoodEntryResponse {
  id: number;
  userId: number;
  date: string; // ISO date format
  mood: MoodType;
  notes?: string;
  createdAt: string; // ISO datetime format
}

type MoodType = 'VERY_HAPPY' | 'HAPPY' | 'NEUTRAL' | 'SAD' | 'VERY_SAD';

interface MoodSummary {
  averageMood: number; // Average mood value (1-5)
  moodCounts: {
    [key in MoodType]?: number;
  };
  totalEntries: number;
  startDate: string;
  endDate: string;
}

export type { MoodEntryRequest, MoodEntryResponse, MoodSummary, MoodType };
