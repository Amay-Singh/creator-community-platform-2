import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { CreatorCard } from "../creator-card";
import type { User } from "@/types";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

const mockCreator: User = {
  id: "1",
  email: "test@example.com",
  name: "Maya Chen",
  username: "mayachen",
  avatar: undefined,
  bio: "Electronic music producer",
  category: "musician",
  location: "Los Angeles, CA",
  skills: ["Production", "Mixing", "Sound Design", "Ableton"],
  externalLinks: [],
  followers: 3420,
  following: 245,
  collaborations: 12,
  profileHealth: 92,
  isPremium: true,
  createdAt: "2025-06-15",
  updatedAt: "2026-02-10",
};

describe("CreatorCard", () => {
  it("renders creator name and username in grid view", () => {
    render(<CreatorCard creator={mockCreator} view="grid" />, { wrapper: Wrapper });
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText("@mayachen")).toBeInTheDocument();
  });

  it("renders creator name and username in list view", () => {
    render(<CreatorCard creator={mockCreator} view="list" />, { wrapper: Wrapper });
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText("@mayachen")).toBeInTheDocument();
  });

  it("shows category badge", () => {
    render(<CreatorCard creator={mockCreator} />, { wrapper: Wrapper });
    expect(screen.getByText("musician")).toBeInTheDocument();
  });

  it("shows location when provided", () => {
    render(<CreatorCard creator={mockCreator} />, { wrapper: Wrapper });
    expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
  });

  it("shows follower count", () => {
    render(<CreatorCard creator={mockCreator} />, { wrapper: Wrapper });
    expect(screen.getByText("3,420")).toBeInTheDocument();
  });

  it("shows skills in grid view", () => {
    render(<CreatorCard creator={mockCreator} view="grid" />, { wrapper: Wrapper });
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Mixing")).toBeInTheDocument();
    expect(screen.getByText("Sound Design")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("renders AI badge when isAiRecommended", () => {
    render(<CreatorCard creator={mockCreator} isAiRecommended />, { wrapper: Wrapper });
    const sparklesIcons = document.querySelectorAll(".lucide-sparkles");
    expect(sparklesIcons.length).toBeGreaterThan(0);
  });

  it("renders Follow and Collaborate buttons", () => {
    render(<CreatorCard creator={mockCreator} />, { wrapper: Wrapper });
    expect(screen.getByText("Follow")).toBeInTheDocument();
    expect(screen.getByText("Collaborate")).toBeInTheDocument();
  });
});
