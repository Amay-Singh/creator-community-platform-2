export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  category: CreatorCategory;
  location?: string;
  skills: string[];
  externalLinks: ExternalLink[];
  followers: number;
  following: number;
  collaborations: number;
  profileHealth: number;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreatorCategory =
  | "musician"
  | "visual-artist"
  | "photographer"
  | "videographer"
  | "writer"
  | "dancer"
  | "influencer"
  | "designer"
  | "other";

export interface ExternalLink {
  platform: "instagram" | "youtube" | "spotify" | "github" | "behance" | "website" | "other";
  url: string;
  label?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  mediaType: "image" | "video" | "audio";
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "archived";
  members: CollaborationMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationMember {
  userId: string;
  role: "owner" | "member";
  joinedAt: string;
}

export interface Notification {
  id: string;
  type: "collab_invite" | "message" | "follow" | "system";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
