import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProjectCard, type Project } from "../project-card";

const mockProject: Project = {
  id: "p1",
  title: "Urban Beats EP",
  description: "A collaborative EP blending electronic beats with urban photography visuals.",
  status: "active",
  members: [
    { name: "Maya Chen" },
    { name: "Alex Rivera" },
    { name: "Sam Taylor" },
  ],
  tasksTotal: 12,
  tasksDone: 7,
  createdAt: "Jan 28, 2026",
};

describe("ProjectCard", () => {
  it("renders project title", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Urban Beats EP")).toBeInTheDocument();
  });

  it("renders project description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText(/collaborative EP/)).toBeInTheDocument();
  });

  it("shows status badge", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("displays task progress", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("7/12")).toBeInTheDocument();
    expect(screen.getByText("58%")).toBeInTheDocument();
  });

  it("shows member avatars", () => {
    render(<ProjectCard project={mockProject} />);
    const avatarElements = document.querySelectorAll("[aria-label]");
    expect(avatarElements.length).toBeGreaterThan(0);
  });

  it("renders as a link to project detail", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/collaborations/p1");
  });

  it("shows creation date", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Jan 28, 2026")).toBeInTheDocument();
  });
});
