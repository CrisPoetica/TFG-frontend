interface GoalResponse {
  id: number;
  title: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  createdAt: string | null;
}

export type { GoalResponse };
