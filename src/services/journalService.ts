import axios from 'axios';
import type { JournalEntryRequest, JournalEntryResponse } from '../types/journal';
import { getToken } from './authService';

const API_URL = 'http://localhost:8092/api/v1/journal';

// Configurar axios para incluir el token en cada solicitud
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const createEntry = async (entry: JournalEntryRequest): Promise<JournalEntryResponse> => {
  try {
    const response = await authAxios.post<JournalEntryResponse>(API_URL, entry);
    return response.data;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

export const getAllEntries = async (): Promise<JournalEntryResponse[]> => {
  try {
    const response = await authAxios.get<JournalEntryResponse[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting all journal entries:', error);
    throw error;
  }
};

export const getEntryById = async (entryId: number): Promise<JournalEntryResponse> => {
  try {
    const response = await authAxios.get<JournalEntryResponse>(`${API_URL}/${entryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting journal entry ${entryId}:`, error);
    throw error;
  }
};

export const updateEntry = async (entryId: number, entry: JournalEntryRequest): Promise<JournalEntryResponse> => {
  try {
    const response = await authAxios.put<JournalEntryResponse>(`${API_URL}/${entryId}`, entry);
    return response.data;
  } catch (error) {
    console.error(`Error updating journal entry ${entryId}:`, error);
    throw error;
  }
};

export const deleteEntry = async (entryId: number): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/${entryId}`);
  } catch (error) {
    console.error(`Error deleting journal entry ${entryId}:`, error);
    throw error;
  }
};
