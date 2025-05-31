// Definir los tipos
interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_login?: boolean;
}

interface AuthResponse {
  token: string;
}

// Exportarlos todos juntos como módulo de tipos
export type { LoginRequest, RegisterRequest, UserResponse, AuthResponse };
