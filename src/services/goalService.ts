import axios from 'axios';
import type { GoalResponse } from '../types/goal';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1/goals';

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getAllGoals = async (): Promise<GoalResponse[]> => {
  try {
    const response = await authAxios.get<GoalResponse[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting all goals:', error);
    throw error;
  }
};

export const generateGoals = async (): Promise<GoalResponse[]> => {
  try {
    const response = await authAxios.post<GoalResponse[]>(`${API_URL}/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating goals:', error);
    throw error;
  }
};
