import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserResponse } from '../types/auth';
import * as authService from '../services/authService';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  firstLogin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    // Comprobar si hay un usuario en localStorage
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      // Solo establecer firstLogin como true si realmente es la primera vez
      // que el usuario inicia sesión (basado en localStorage)
      const isFirstTime = localStorage.getItem('first_time_user') === 'true';
      setFirstLogin(isFirstTime);
      // Una vez que se ha usado esta información, actualizar localStorage
      if (isFirstTime) {
        localStorage.setItem('first_time_user', 'false');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Llamar al servicio de login
      await authService.login({ username, password });
      
      // Simular obtención de datos de usuario (en un caso real, podría
      // ser un endpoint separado o información en el JWT)
      const userResponse: UserResponse = {
        id: 1, // Este valor debería venir del backend
        username,
        email: '', // Este valor debería venir del backend
        first_login: true // Este valor debería venir del backend
      };
      
      // Marcar como primer inicio de sesión en localStorage
      localStorage.setItem('first_time_user', 'true');
      
      authService.saveUser(userResponse);
      setUser(userResponse);
      setFirstLogin(!!userResponse.first_login);
      setLoading(false);
    } catch (err) {
      setError('Error al iniciar sesión. Comprueba tus credenciales.');
      setLoading(false);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register({ username, email, password });
      setUser(newUser);
      setFirstLogin(true);
      authService.saveUser(newUser);
      setLoading(false);
    } catch (err) {
      setError('Error al registrar. Intenta con otro nombre de usuario o correo.');
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      // Eliminar los datos de usuario y conversación al cerrar sesión
      localStorage.removeItem('currentConversationId');
      localStorage.removeItem('first_time_user');
      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error('Error during logout:', err);
      // Aún así, eliminamos los datos del usuario
      localStorage.removeItem('currentConversationId');
      localStorage.removeItem('first_time_user');
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    firstLogin,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
