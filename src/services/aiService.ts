import axios from 'axios';
import type { ConversationResponse, MessageRequest, MessageResponse } from '../types/ai';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1/ai';

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const startConversation = async (): Promise<ConversationResponse> => {
  try {
    const response = await authAxios.post<ConversationResponse>(`${API_URL}/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

export const getConversation = async (conversationId: number): Promise<ConversationResponse> => {
  try {
    const response = await authAxios.get<ConversationResponse>(`${API_URL}/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting conversation ${conversationId}:`, error);
    throw error;
  }
};

export const sendMessage = async (conversationId: number, message: MessageRequest): Promise<MessageResponse> => {
  try {
    const response = await authAxios.post<MessageResponse>(
      `${API_URL}/conversations/${conversationId}/messages`, 
      message
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending message to conversation ${conversationId}:`, error);
    throw error;
  }
};
