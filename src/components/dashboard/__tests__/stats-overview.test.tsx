import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsOverview } from "../stats-overview";

describe("StatsOverview", () => {
  it("renders all 4 stat cards", () => {
    render(<StatsOverview />);
    expect(screen.getByText("Profile Health")).toBeInTheDocument();
    expect(screen.getByText("Followers")).toBeInTheDocument();
    expect(screen.getByText("Active Projects")).toBeInTheDocument();
    expect(screen.getByText("Profile Views")).toBeInTheDocument();
  });

  it("renders stat values", () => {
    render(<StatsOverview />);
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("1,247")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("3.2K")).toBeInTheDocument();
  });

  it("renders change indicators", () => {
    render(<StatsOverview />);
    expect(screen.getByText("+5%")).toBeInTheDocument();
    expect(screen.getByText("+23")).toBeInTheDocument();
  });

  it("has an accessible section label", () => {
    render(<StatsOverview />);
    expect(screen.getByRole("region", { name: "Statistics overview" })).toBeInTheDocument();
  });
});
