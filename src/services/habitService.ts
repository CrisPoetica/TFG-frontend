import axios from 'axios';
import type { CreateHabitRequest, HabitResponse, LogHabitRequest, HabitLogResponse } from '../types/habit';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1/habits';

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const createHabit = async (habit: CreateHabitRequest): Promise<HabitResponse> => {
  try {
    const response = await authAxios.post<HabitResponse>(API_URL, habit);
    return response.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const getAllHabits = async (): Promise<HabitResponse[]> => {
  try {
    const response = await authAxios.get<HabitResponse[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting all habits:', error);
    throw error;
  }
};

export const updateHabit = async (habitId: number, habit: CreateHabitRequest): Promise<HabitResponse> => {
  try {
    const response = await authAxios.put<HabitResponse>(`${API_URL}/${habitId}`, habit);
    return response.data;
  } catch (error) {
    console.error(`Error updating habit ${habitId}:`, error);
    throw error;
  }
};

export const deleteHabit = async (habitId: number): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/${habitId}`);
  } catch (error) {
    console.error(`Error deleting habit ${habitId}:`, error);
    throw error;
  }
};

export const logHabit = async (habitId: number, log: LogHabitRequest): Promise<HabitLogResponse> => {
  try {
    const response = await authAxios.post<HabitLogResponse>(`${API_URL}/${habitId}/logs`, log);
    return response.data;
  } catch (error) {
    console.error(`Error logging habit ${habitId}:`, error);
    throw error;
  }
};

export const getHabitLogs = async (habitId: number, from: string, to: string): Promise<HabitLogResponse[]> => {
  try {
    const response = await authAxios.get<HabitLogResponse[]>(
      `${API_URL}/${habitId}/logs?from=${from}&to=${to}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting logs for habit ${habitId}:`, error);
    throw error;
  }
};

export const generateHabits = async (): Promise<HabitResponse[]> => {
  try {
    const response = await authAxios.post<HabitResponse[]>(`${API_URL}/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating habits:', error);
    throw error;
  }
};

export function getUserHabits() {
  throw new Error('Function not implemented.');
}
