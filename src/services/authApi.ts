import { httpClient } from './httpClient';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ValidateTokenResponse {
  valid: boolean;
  user_id?: string;
}

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return httpClient.post('/register', data);
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return httpClient.post('/login', credentials);
  },

  async logout(token?: string): Promise<{ success: boolean }> {
    return httpClient.post('/logout', {}, token);
  },

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    return httpClient.post('/validate', { token });
  },

  async refreshToken(token: string): Promise<{ access_token: string }> {
    return httpClient.post('/refresh', {}, token);
  },
};
