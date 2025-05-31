interface CreateHabitRequest {
  name: string;
  description: string;
  frequency: string;
}

interface LogHabitRequest {
  date: string;
  notes?: string;
  completed: boolean;
}

interface HabitResponse {
  id: number;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
}

interface HabitLogResponse {
  id: number;
  habitId: number;
  date: string;
  notes?: string;
  completed: boolean;
}

export type { CreateHabitRequest, LogHabitRequest, HabitResponse, HabitLogResponse };
