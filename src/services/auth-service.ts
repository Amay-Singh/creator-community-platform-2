import { apiClient } from "@/lib/api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
  category: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
  };
}

export const authService = {
  login: (data: LoginRequest) => apiClient.post<AuthResponse>("/auth/login", data),
  register: (data: RegisterRequest) => apiClient.post<AuthResponse>("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get<AuthResponse["user"]>("/auth/me"),
};
