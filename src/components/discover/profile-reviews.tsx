"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
  collaborationType: string;
}

const mockReviews: Review[] = [
  {
    id: "r1",
    authorName: "Alex Rivera",
    rating: 5,
    text: "Incredible collaborator! Maya's production skills elevated our photo-music project to a whole new level. Communication was smooth and deadlines were always met.",
    date: "2 weeks ago",
    helpful: 12,
    collaborationType: "Music Production",
  },
  {
    id: "r2",
    authorName: "Jordan Lee",
    rating: 4,
    text: "Great to work with on the animation project. Very creative with sound design. Would love to collaborate again on future projects.",
    date: "1 month ago",
    helpful: 8,
    collaborationType: "Sound Design",
  },
  {
    id: "r3",
    authorName: "Sam Taylor",
    rating: 5,
    text: "Maya brought the perfect soundtrack for our short film. Professional, talented, and incredibly easy to work with. Highly recommend!",
    date: "2 months ago",
    helpful: 15,
    collaborationType: "Film Scoring",
  },
];

function StarRating({ rating, interactive, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={cn("transition-colors", interactive ? "cursor-pointer" : "cursor-default")}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "h-4 w-4",
              (hover || rating) >= star
                ? "fill-secondary-orange text-secondary-orange"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

interface ProfileReviewsProps {
  creatorName: string;
  className?: string;
}

export function ProfileReviews({ creatorName, className }: ProfileReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newText, setNewText] = useState("");
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  function handleSubmitReview() {
    if (newRating === 0 || !newText.trim()) return;
    // TODO: Connect to backend API
    setShowForm(false);
    setNewRating(0);
    setNewText("");
  }

  function toggleHelpful(id: string) {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-card-foreground">{avgRating}</span>
          <div>
            <StarRating rating={Math.round(Number(avgRating))} />
            <p className="mt-0.5 text-xs text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowForm(!showForm)}>
          <MessageSquare className="h-3.5 w-3.5" />
          Write Review
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-medium text-card-foreground">Rate your collaboration with {creatorName}</p>
          <StarRating rating={newRating} interactive onRate={setNewRating} />
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Share your experience working with this creator..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            aria-label="Review text"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={handleSubmitReview}
              disabled={newRating === 0 || !newText.trim()}
            >
              <Send className="h-3.5 w-3.5" />
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar alt={review.authorName} src={review.authorAvatar} size="sm" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">{review.authorName}</p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-[10px] text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" size="sm">{review.collaborationType}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => toggleHelpful(review.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors",
                  helpfulIds.has(review.id)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
                aria-label="Mark as helpful"
              >
                <ThumbsUp className="h-3 w-3" />
                Helpful ({review.helpful + (helpfulIds.has(review.id) ? 1 : 0)})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
