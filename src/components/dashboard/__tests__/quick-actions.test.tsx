import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuickActions } from "../quick-actions";

describe("QuickActions", () => {
  it("renders all 3 action cards", () => {
    render(<QuickActions />);
    expect(screen.getByText("Find Collaborators")).toBeInTheDocument();
    expect(screen.getByText("AI Tools")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
  });

  it("renders descriptions", () => {
    render(<QuickActions />);
    expect(screen.getByText("Discover creators who match your style")).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<QuickActions />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/explore");
    expect(links[1]).toHaveAttribute("href", "/ai-studio");
    expect(links[2]).toHaveAttribute("href", "/collaborations/new");
  });

  it("has an accessible section label", () => {
    render(<QuickActions />);
    expect(screen.getByRole("region", { name: "Quick actions" })).toBeInTheDocument();
  });
});
