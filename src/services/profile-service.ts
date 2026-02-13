import { apiClient } from "@/lib/api-client";
import type { User, PortfolioItem, ApiPaginatedResponse } from "@/types";

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  category?: string;
  location?: string;
  skills?: string[];
  externalLinks?: { platform: string; url: string; label?: string }[];
}

export const profileService = {
  getProfile: (userId: string) => apiClient.get<User>(`/users/${userId}`),
  updateProfile: (userId: string, data: UpdateProfileRequest) =>
    apiClient.patch<User>(`/users/${userId}`, data),
  getPortfolio: (userId: string, page = 1, pageSize = 12) =>
    apiClient.get<ApiPaginatedResponse<PortfolioItem>>(`/users/${userId}/portfolio`, {
      params: { page: String(page), pageSize: String(pageSize) },
    }),
  searchCreators: (params: Record<string, string>) =>
    apiClient.get<ApiPaginatedResponse<User>>("/users/search", { params }),
  followUser: (userId: string) => apiClient.post(`/users/${userId}/follow`),
  unfollowUser: (userId: string) => apiClient.delete(`/users/${userId}/follow`),
};
