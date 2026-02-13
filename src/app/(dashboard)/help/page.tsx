"use client";

import { useState } from "react";
import { HelpCircle, BookOpen, MessageSquare, ExternalLink, ChevronDown, Search, GraduationCap, Lightbulb, Video, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const faqItems = [
  { id: "faq1", question: "How do I start a collaboration?", answer: "Visit the Explore page to find creators, then click 'Collaborate' on their profile. You can also send collab invites from the Collaborations page with a project brief and match reasoning.", category: "collaboration" },
  { id: "faq2", question: "How does AI content generation work?", answer: "The AI Content Studio uses machine learning to generate text content based on your prompts. Choose a content type, set your tone and audience, then click Generate. You can regenerate, rate, and refine outputs.", category: "ai" },
  { id: "faq3", question: "How do I improve my profile health score?", answer: "Complete all profile sections: bio, skills, portfolio items, external links, and a profile photo. Active collaboration history and positive reviews also boost your score.", category: "profile" },
  { id: "faq4", question: "What's included in the premium subscription?", answer: "Premium includes AI Portfolio Generator, priority in search results, unlimited collab invites, auto-translation, and ad-free experience. Check the Settings > Billing tab for current plans.", category: "billing" },
  { id: "faq5", question: "How do video/audio calls work?", answer: "Click the phone or video icon in any conversation to start a call. Calls support mute, camera toggle, screen sharing, and work for both 1:1 and group chats.", category: "messaging" },
  { id: "faq6", question: "How do I report inappropriate content?", answer: "Use the AI Content Validator on any profile to flag suspicious content. For direct reports, click the menu icon on any message or profile and select 'Report'.", category: "safety" },
];

const resources = [
  { id: "r1", title: "Music Production Fundamentals", type: "Course", duration: "8 hours", icon: Headphones, url: "#", level: "Beginner" },
  { id: "r2", title: "Photography Composition Masterclass", type: "Course", duration: "5 hours", icon: Video, url: "#", level: "Intermediate" },
  { id: "r3", title: "Building Your Creator Brand", type: "Article", duration: "15 min read", icon: BookOpen, url: "#", level: "All Levels" },
  { id: "r4", title: "Effective Remote Collaboration", type: "Guide", duration: "10 min read", icon: Lightbulb, url: "#", level: "All Levels" },
  { id: "r5", title: "Video Editing for Social Media", type: "Course", duration: "6 hours", icon: Video, url: "#", level: "Beginner" },
  { id: "r6", title: "Negotiating Creative Contracts", type: "Article", duration: "12 min read", icon: BookOpen, url: "#", level: "Advanced" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [activeSection, setActiveSection] = useState<"faq" | "resources" | "feedback">("faq");

  const filteredFaqs = searchQuery
    ? faqItems.filter((f) => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqItems;

  function handleSubmitFeedback() {
    if (!feedbackText.trim()) return;
    // TODO: Connect to backend API
    setFeedbackSent(true);
    setFeedbackText("");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-md">
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Help & Resources</h1>
          <p className="text-sm text-muted-foreground">Find answers, learn new skills, and share feedback</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help articles, FAQs, resources..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          aria-label="Search help"
        />
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
        {([
          { id: "faq" as const, label: "FAQ", icon: HelpCircle },
          { id: "resources" as const, label: "Upskilling", icon: GraduationCap },
          { id: "feedback" as const, label: "Feedback", icon: MessageSquare },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeSection === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={activeSection === tab.id}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      {activeSection === "faq" && (
        <div className="space-y-2">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-card-foreground">{faq.question}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expandedFaq === faq.id && "rotate-180")} />
              </button>
              {expandedFaq === faq.id && (
                <div className="border-t border-border px-5 py-4 bg-muted/20">
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                  <Badge variant="outline" size="sm" className="mt-2">{faq.category}</Badge>
                </div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}

      {/* Resources / Upskilling Section */}
      {activeSection === "resources" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-card hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <resource.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground">{resource.title}</p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" size="sm">{resource.type}</Badge>
                  <span className="text-[10px] text-muted-foreground">{resource.duration}</span>
                  <Badge variant="primary" size="sm">{resource.level}</Badge>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
            </a>
          ))}
        </div>
      )}

      {/* Feedback Section */}
      {activeSection === "feedback" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          {!feedbackSent ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">Share Your Feedback</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Help us improve Colab by sharing your thoughts, suggestions, or reporting issues.</p>
              </div>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                aria-label="Feedback text"
              />
              <div className="flex justify-end">
                <Button variant="gradient" onClick={handleSubmitFeedback} disabled={!feedbackText.trim()}>
                  <MessageSquare className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-emerald/10 mb-4">
                <MessageSquare className="h-7 w-7 text-secondary-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Thank you!</h3>
              <p className="mt-1 text-sm text-muted-foreground">Your feedback has been submitted and will help us improve.</p>
              <Button variant="ghost" size="sm" onClick={() => setFeedbackSent(false)} className="mt-4">
                Send More Feedback
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
