import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies primary variant", () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText("Primary");
    expect(badge.className).toContain("text-primary");
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText("Active");
    expect(badge.className).toContain("text-secondary-emerald");
  });

  it("applies md size", () => {
    render(<Badge size="md">Medium</Badge>);
    const badge = screen.getByText("Medium");
    expect(badge.className).toContain("text-sm");
  });

  it("applies custom className", () => {
    render(<Badge className="custom">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("custom");
  });
});
