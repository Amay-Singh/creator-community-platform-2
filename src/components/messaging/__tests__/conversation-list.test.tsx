import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConversationList, type Conversation } from "../conversation-list";

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "Maya Chen",
    isOnline: true,
    lastMessage: "Let's finalize the beat",
    timestamp: "2m ago",
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "c2",
    name: "Urban Beats Team",
    isOnline: true,
    lastMessage: "Sam: new footage uploaded",
    timestamp: "15m ago",
    unreadCount: 0,
    isGroup: true,
  },
];

describe("ConversationList", () => {
  it("renders conversation names", () => {
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={() => {}} />);
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.getByText(/Urban Beats Team/)).toBeInTheDocument();
  });

  it("renders last messages", () => {
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={() => {}} />);
    expect(screen.getByText("Let's finalize the beat")).toBeInTheDocument();
  });

  it("shows unread badge when count > 0", () => {
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={() => {}} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("calls onSelect when conversation clicked", () => {
    const onSelect = vi.fn();
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Maya Chen"));
    expect(onSelect).toHaveBeenCalledWith("c1");
  });

  it("renders search input", () => {
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={() => {}} />);
    expect(screen.getByLabelText("Search conversations")).toBeInTheDocument();
  });

  it("shows group indicator for group conversations", () => {
    render(<ConversationList conversations={mockConversations} activeId={null} onSelect={() => {}} />);
    expect(screen.getByText("(group)")).toBeInTheDocument();
  });
});
