import { apiClient } from "./api";

// Type Definitions
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  userId: number;
  expiresAt: string;
}

export interface UserResponse {
  id: number;
  email: string;
  createdAt: string;
}

// Auth Service
class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    this.setAuthToken(response.token);
    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    this.setAuthToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return apiClient.get<UserResponse>("/auth/me", true);
  }

  setAuthToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  removeAuthToken(): void {
    localStorage.removeItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    this.removeAuthToken();
  }
}

export const authService = new AuthService();
