interface TaskRequest {
  title?: string;
  description?: string;
  dueDate?: string; // Formato ISO
  completed?: boolean;
  dayOfWeek?: string;
  type?: string;
}

interface TaskResponse {
  id: number;
  userId?: number;
  title?: string;
  description?: string;
  dueDate?: string; // Formato ISO
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  dayOfWeek?: string;
  type?: string;
}

export type { TaskRequest, TaskResponse };
