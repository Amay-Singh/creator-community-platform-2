export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          skills: string[];
          location: string | null;
          external_links: Json | null;
          health_score: number;
          is_premium: boolean;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          skills?: string[];
          location?: string | null;
          external_links?: Json | null;
          health_score?: number;
          is_premium?: boolean;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          skills?: string[];
          location?: string | null;
          external_links?: Json | null;
          health_score?: number;
          is_premium?: boolean;
          language?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          name: string | null;
          is_group: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          is_group?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string | null;
          is_group?: boolean;
          updated_at?: string;
        };
      };
      conversation_members: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: "admin" | "member";
          joined_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role?: "admin" | "member";
          joined_at?: string;
        };
        Update: {
          role?: "admin" | "member";
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          attachment_url: string | null;
          attachment_name: string | null;
          attachment_type: string | null;
          attachment_size: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          text: string;
          attachment_url?: string | null;
          attachment_name?: string | null;
          attachment_type?: string | null;
          attachment_size?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          text?: string;
          updated_at?: string;
        };
      };
      message_reactions: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {};
      };
      message_read_receipts: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          read_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          read_at?: string;
        };
        Update: {};
      };
      collaborations: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: "active" | "completed" | "archived";
          owner_id: string;
          category: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: "active" | "completed" | "archived";
          owner_id: string;
          category?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: "active" | "completed" | "archived";
          category?: string | null;
          tags?: string[];
          updated_at?: string;
        };
      };
      collaboration_members: {
        Row: {
          id: string;
          collaboration_id: string;
          user_id: string;
          role: "owner" | "admin" | "member";
          status: "pending" | "accepted" | "declined";
          joined_at: string;
        };
        Insert: {
          id?: string;
          collaboration_id: string;
          user_id: string;
          role?: "owner" | "admin" | "member";
          status?: "pending" | "accepted" | "declined";
          joined_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "member";
          status?: "pending" | "accepted" | "declined";
        };
      };
      milestones: {
        Row: {
          id: string;
          collaboration_id: string;
          title: string;
          description: string | null;
          status: "pending" | "in_progress" | "completed";
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          collaboration_id: string;
          title: string;
          description?: string | null;
          status?: "pending" | "in_progress" | "completed";
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: "pending" | "in_progress" | "completed";
          due_date?: string | null;
        };
      };
      files: {
        Row: {
          id: string;
          collaboration_id: string | null;
          uploaded_by: string;
          name: string;
          storage_path: string;
          size_bytes: number;
          mime_type: string;
          version: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          collaboration_id?: string | null;
          uploaded_by: string;
          name: string;
          storage_path: string;
          size_bytes: number;
          mime_type: string;
          version?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          version?: number;
        };
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          created_by: string;
          conversation_id: string | null;
          scheduled_at: string;
          duration_minutes: number;
          meeting_link: string;
          status: "scheduled" | "in_progress" | "completed" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_by: string;
          conversation_id?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          meeting_link: string;
          status?: "scheduled" | "in_progress" | "completed" | "cancelled";
          created_at?: string;
        };
        Update: {
          title?: string;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: "scheduled" | "in_progress" | "completed" | "cancelled";
        };
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          text: string;
          helpful_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          text: string;
          helpful_count?: number;
          created_at?: string;
        };
        Update: {
          text?: string;
          helpful_count?: number;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          content_type: string;
          prompt: string;
          output: string;
          tone: string | null;
          audience: string | null;
          word_count: number | null;
          quality_score: number | null;
          user_rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: string;
          prompt: string;
          output: string;
          tone?: string | null;
          audience?: string | null;
          word_count?: number | null;
          quality_score?: number | null;
          user_rating?: number | null;
          created_at?: string;
        };
        Update: {
          user_rating?: number | null;
          quality_score?: number | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "free" | "premium" | "enterprise";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: "active" | "cancelled" | "past_due";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: "free" | "premium" | "enterprise";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "active" | "cancelled" | "past_due";
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: "free" | "premium" | "enterprise";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: "active" | "cancelled" | "past_due";
          current_period_end?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
