import axios from 'axios';
import type { TaskRequest, TaskResponse } from '../types/task';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1';

// Esta constante se usará temporalmente hasta implementar autenticación completa
const TEST_USER_ID = 1;

const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getAllTasksForUser = async (): Promise<TaskResponse[]> => {
  try {
    const response = await authAxios.get<TaskResponse[]>(
      `${API_URL}/users/${TEST_USER_ID}/tasks`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const getTaskById = async (taskId: number): Promise<TaskResponse> => {
  try {
    const response = await authAxios.get<TaskResponse>(
      `${API_URL}/users/${TEST_USER_ID}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with id ${taskId}:`, error);
    throw error;
  }
};

export const createTask = async (taskData: TaskRequest): Promise<TaskResponse> => {
  try {
    // Configuración específica para esta solicitud POST
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    const response = await authAxios.post<TaskResponse>(
      `${API_URL}/users/${TEST_USER_ID}/tasks`,
      taskData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: number, taskData: TaskRequest): Promise<TaskResponse> => {
  try {
    const response = await authAxios.put<TaskResponse>(
      `${API_URL}/users/${TEST_USER_ID}/tasks/${taskId}`,
      taskData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating task with id ${taskId}:`, error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/users/${TEST_USER_ID}/tasks/${taskId}`);
  } catch (error) {
    console.error(`Error deleting task with id ${taskId}:`, error);
    throw error;
  }
};

// Funciu00f3n auxiliar para actualizar el estado de completado de una tarea
export const toggleTaskCompletion = async (taskId: number, completed: boolean): Promise<TaskResponse> => {
  try {
    const task = await getTaskById(taskId);
    const updatedTask: TaskRequest = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: completed
    };
    
    return await updateTask(taskId, updatedTask);
  } catch (error) {
    console.error(`Error toggling completion for task with id ${taskId}:`, error);
    throw error;
  }
};
