import axios from 'axios';
import type { CreatePlanRequest, PlanResponse, TaskResponse } from '../types/plan';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1/plans';

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const createPlan = async (weekStart: string): Promise<PlanResponse> => {
  try {
    const request: CreatePlanRequest = { weekStart };
    const response = await authAxios.post<PlanResponse>(API_URL, request);
    return response.data;
  } catch (error) {
    console.error('Error creating plan:', error);
    throw error;
  }
};

export const getCurrentPlan = async (): Promise<PlanResponse> => {
  try {
    const response = await authAxios.get<PlanResponse>(`${API_URL}/current`);
    return response.data;
  } catch (error) {
    console.error('Error getting current plan:', error);
    throw error;
  }
};

export const getPlanTasks = async (planId: number): Promise<TaskResponse[]> => {
  try {
    const response = await authAxios.get<TaskResponse[]>(`${API_URL}/${planId}/tasks`);
    return response.data;
  } catch (error) {
    console.error(`Error getting tasks for plan ${planId}:`, error);
    throw error;
  }
};

export const toggleTask = async (planId: number, taskId: number, completed: boolean): Promise<TaskResponse> => {
  try {
    const response = await authAxios.patch<TaskResponse>(
      `${API_URL}/${planId}/tasks/${taskId}`,
      { completed }
    );
    return response.data;
  } catch (error) {
    console.error(`Error toggling task ${taskId} completion:`, error);
    throw error;
  }
};
