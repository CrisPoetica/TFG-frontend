import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types/auth';

const API_URL = 'http://localhost:8092/api/v1/auth';

export const login = async (credentials: LoginRequest): Promise<string> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
    const token = response.data.token;
    
    // Guardar el token en localStorage
    localStorage.setItem('token', token);
    
    return token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<UserResponse> => {
  try {
    const response = await axios.post<UserResponse>(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/logout`);
    // Eliminar el token de localStorage
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error during logout:', error);
    // Eliminar el token incluso si hay error en la API
    localStorage.removeItem('token');
    throw error;
  }
};

export const getCurrentUser = (): UserResponse | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

export const saveUser = (user: UserResponse): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
