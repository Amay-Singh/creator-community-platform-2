"use client";

import { useState, useCallback } from "react";
import { ConversationList, type Conversation } from "@/components/messaging/conversation-list";
import { ChatWindow, type Message } from "@/components/messaging/chat-window";
import { MemberPanel } from "@/components/messaging/member-panel";
import { GroupChatManager } from "@/components/messaging/group-chat-manager";
import { MeetingInvite } from "@/components/messaging/meeting-invite";
import { VideoCall } from "@/components/messaging/video-call";

const mockConversations: Conversation[] = [
  {
    id: "c1",
    name: "Maya Chen",
    isOnline: true,
    lastMessage: "Let's finalize the beat for track 3",
    timestamp: "2m ago",
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "c2",
    name: "Urban Beats Team",
    isOnline: true,
    lastMessage: "Sam: I uploaded the new footage",
    timestamp: "15m ago",
    unreadCount: 5,
    isGroup: true,
  },
  {
    id: "c3",
    name: "Alex Rivera",
    isOnline: false,
    lastMessage: "The photos look amazing! 🔥",
    timestamp: "1h ago",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "c4",
    name: "Jordan Lee",
    isOnline: true,
    lastMessage: "Can you review the animation?",
    timestamp: "3h ago",
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: "c5",
    name: "Riley Morgan",
    isOnline: false,
    lastMessage: "Thanks for the feedback!",
    timestamp: "1d ago",
    unreadCount: 0,
    isGroup: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: "m1", senderId: "maya", text: "Hey! How's the mix coming along?", timestamp: "10:15 AM", isMine: false, status: "read" },
    { id: "m2", senderId: "me", text: "Almost done! I'm tweaking the bass on track 2", timestamp: "10:18 AM", isMine: true, status: "read" },
    { id: "m3", senderId: "maya", text: "Nice. Can you send me a preview when you're ready?", timestamp: "10:20 AM", isMine: false, status: "read" },
    { id: "m4", senderId: "me", text: "Will do. Should be ready in about an hour", timestamp: "10:22 AM", isMine: true, status: "read" },
    { id: "m5", senderId: "maya", text: "Perfect! Also, I had some ideas for the album cover", timestamp: "10:25 AM", isMine: false, status: "read" },
    { id: "m6", senderId: "maya", text: "Let's finalize the beat for track 3", timestamp: "10:30 AM", isMine: false, status: "read", reactions: [{ emoji: "🔥", count: 1, byMe: true }] },
  ],
  c2: [
    { id: "m7", senderId: "sam", text: "I uploaded the new footage to the shared drive", timestamp: "9:45 AM", isMine: false, status: "read", attachment: { name: "footage-v2.mp4", type: "video", size: "87 MB" } },
    { id: "m8", senderId: "alex", text: "Looks great! The lighting is perfect", timestamp: "9:50 AM", isMine: false, status: "read" },
    { id: "m9", senderId: "me", text: "Amazing work everyone. Let's sync up tomorrow", timestamp: "9:55 AM", isMine: true, status: "delivered" },
  ],
  c3: [
    { id: "m10", senderId: "alex", text: "Just sent you the final edits for the street series", timestamp: "Yesterday", isMine: false, status: "read" },
    { id: "m11", senderId: "me", text: "The photos look amazing! 🔥", timestamp: "Yesterday", isMine: true, status: "read" },
  ],
};

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string | null>("c1");
  const [messages, setMessages] = useState(mockMessages);
  const [showPanel, setShowPanel] = useState(false);
  const [activeCall, setActiveCall] = useState<{ type: "audio" | "video"; name: string } | null>(null);

  const activeConv = mockConversations.find((c) => c.id === activeConversation);
  const activeMessages = activeConversation ? (messages[activeConversation] || []) : [];

  const handleSendMessage = useCallback((text: string) => {
    if (!activeConversation) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
      status: "sent",
    };
    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation] || []), newMsg],
    }));
  }, [activeConversation]);

  function handleStartCall(type: "audio" | "video") {
    if (activeConv) {
      setActiveCall({ type, name: activeConv.name });
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Video/Audio Call Overlay (P5.6) */}
      {activeCall && (
        <VideoCall
          callType={activeCall.type}
          callerName={activeCall.name}
          onEndCall={() => setActiveCall(null)}
        />
      )}

      <div className="flex h-[calc(100vh-7rem)] rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        {/* Column 1: Conversation List */}
        <div className="w-80 shrink-0 border-r border-border flex flex-col">
          <ConversationList
            conversations={mockConversations}
            activeId={activeConversation}
            onSelect={setActiveConversation}
          />
          <div className="border-t border-border p-3 space-y-2">
            <GroupChatManager />
            <MeetingInvite />
          </div>
        </div>

        {/* Column 2: Chat Window */}
        <div className="flex-1 min-w-0">
          {activeConv ? (
            <ChatWindow
              conversationName={activeConv.name}
              isOnline={activeConv.isOnline}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
              onStartCall={handleStartCall}
              onTogglePanel={() => setShowPanel(!showPanel)}
              isTyping={activeConv.isOnline && activeConv.id === "c1"}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold text-muted-foreground">Select a conversation</p>
                <p className="mt-1 text-sm text-muted-foreground">Choose from your existing conversations or start a new one</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Member Panel (P5.1) */}
        {showPanel && activeConv && (
          <div className="w-64 shrink-0">
            <MemberPanel
              conversationName={activeConv.name}
              isGroup={activeConv.isGroup}
              onClose={() => setShowPanel(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
