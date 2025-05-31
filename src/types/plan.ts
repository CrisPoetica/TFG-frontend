export interface CreatePlanRequest {
  weekStart: string;
}

export interface TaskResponse {
  id: number;
  description: string;
  dayOfWeek: string;
  type: string;
  completed: boolean;
}

export interface PlanResponse {
  id: number;
  weekStart: string;
  tasks: TaskResponse[];
}
