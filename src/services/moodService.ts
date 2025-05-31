import axios from 'axios';
import type { MoodEntryRequest, MoodEntryResponse, MoodSummary } from '../types/mood';
import { getToken } from './authService';

// Base URL de tu API
const API_URL = 'http://localhost:8092/api/v1';

// Cliente Axios que añade el Bearer token en cada request
const authAxios = axios.create();
authAxios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usuario de prueba mientras no tengas auth completa
const TEST_USER_ID = 1;

export const createMoodEntry = async (moodData: MoodEntryRequest): Promise<MoodEntryResponse> => {
  try {
    const { data } = await authAxios.post<MoodEntryResponse>(
      `${API_URL}/users/${TEST_USER_ID}/moods`,
      moodData
    );
    return data;
  } catch (error) {
    console.error('Error creating mood entry:', error);
    throw error;
  }
};

export const getMoodEntriesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<MoodEntryResponse[]> => {
  try {
    const { data } = await authAxios.get<MoodEntryResponse[]>(
      `${API_URL}/users/${TEST_USER_ID}/moods`,
      { params: { startDate, endDate } }
    );
    return data;
  } catch (error) {
    console.error('Error getting mood entries:', error);
    throw error;
  }
};

export const getMoodEntryByDate = async (date: string): Promise<MoodEntryResponse | null> => {
  try {
    const { data } = await authAxios.get<MoodEntryResponse>(
      `${API_URL}/users/${TEST_USER_ID}/moods/date/${date}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // no hay entrada para esa fecha
    }
    console.error('Error getting mood entry for date:', error);
    throw error;
  }
};

export const updateMoodEntry = async (
  entryId: number,
  moodData: MoodEntryRequest
): Promise<MoodEntryResponse> => {
  try {
    const { data } = await authAxios.put<MoodEntryResponse>(
      `${API_URL}/users/${TEST_USER_ID}/moods/${entryId}`,
      moodData
    );
    return data;
  } catch (error) {
    console.error('Error updating mood entry:', error);
    throw error;
  }
};

export const deleteMoodEntry = async (entryId: number): Promise<void> => {
  try {
    await authAxios.delete(`${API_URL}/users/${TEST_USER_ID}/moods/${entryId}`);
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    throw error;
  }
};

/**
 * Calcula un pequeño resumen a partir de tus entradas de ánimo.
 */
export const calculateMoodSummary = (
  entries: MoodEntryResponse[],
  startDate: string,
  endDate: string
): MoodSummary => {
  const moodValues: Record<string, number> = {
    VERY_HAPPY: 5,
    HAPPY:      4,
    NEUTRAL:    3,
    SAD:        2,
    VERY_SAD:   1,
  };
  
  const moodCounts: Record<string, number> = {};
  let totalMoodValue = 0;
  
  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    totalMoodValue += moodValues[entry.mood] ?? 0;
  });
  
  const averageMood = entries.length > 0
    ? totalMoodValue / entries.length
    : 0;
  
  return {
    averageMood,
    moodCounts,
    totalEntries: entries.length,
    startDate,
    endDate,
  };
};
