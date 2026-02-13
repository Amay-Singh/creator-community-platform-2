"use client";

import { useState } from "react";
import { Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; trait: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What's your ideal creative workflow?",
    options: [
      { value: "structured", label: "Detailed planning, then execution", trait: "Planner" },
      { value: "spontaneous", label: "Go with the flow, improvise", trait: "Improviser" },
      { value: "iterative", label: "Build, test, refine repeatedly", trait: "Iterator" },
      { value: "collaborative", label: "Brainstorm together from the start", trait: "Collaborator" },
    ],
  },
  {
    id: "q2",
    question: "How do you handle creative disagreements?",
    options: [
      { value: "compromise", label: "Find a middle ground", trait: "Diplomat" },
      { value: "data", label: "Let the audience/data decide", trait: "Analyst" },
      { value: "experiment", label: "Try both approaches and compare", trait: "Explorer" },
      { value: "defer", label: "Trust the expert in that area", trait: "Team Player" },
    ],
  },
  {
    id: "q3",
    question: "What motivates you most in a collaboration?",
    options: [
      { value: "learning", label: "Learning new skills", trait: "Learner" },
      { value: "reach", label: "Expanding my audience", trait: "Networker" },
      { value: "quality", label: "Creating something exceptional", trait: "Perfectionist" },
      { value: "fun", label: "Having fun with the process", trait: "Enthusiast" },
    ],
  },
  {
    id: "q4",
    question: "What's your communication style?",
    options: [
      { value: "async", label: "Async messages, respond when ready", trait: "Independent" },
      { value: "scheduled", label: "Regular check-ins and meetings", trait: "Organizer" },
      { value: "realtime", label: "Real-time chat throughout the day", trait: "Connector" },
      { value: "milestone", label: "Touch base only at milestones", trait: "Focused" },
    ],
  },
  {
    id: "q5",
    question: "How do you prefer to share work-in-progress?",
    options: [
      { value: "early", label: "Share rough drafts early for feedback", trait: "Open" },
      { value: "polished", label: "Only show polished versions", trait: "Curator" },
      { value: "live", label: "Work together in real-time sessions", trait: "Live Creator" },
      { value: "documented", label: "Share with detailed notes and context", trait: "Documenter" },
    ],
  },
];

interface PersonalityResult {
  type: string;
  description: string;
  traits: string[];
  matchStrength: Record<string, number>;
}

function computeResult(answers: Record<string, string>): PersonalityResult {
  const traits: string[] = [];
  for (const [qId, value] of Object.entries(answers)) {
    const question = quizQuestions.find((q) => q.id === qId);
    const option = question?.options.find((o) => o.value === value);
    if (option) traits.push(option.trait);
  }

  const type = traits.length >= 3 ? `${traits[0]} ${traits[2]}` : "Creative Spirit";

  return {
    type,
    description: `You're a ${type.toLowerCase()} who values ${traits.slice(0, 3).join(", ").toLowerCase()} in collaborations.`,
    traits,
    matchStrength: {
      musician: Math.floor(Math.random() * 30) + 70,
      "visual-artist": Math.floor(Math.random() * 30) + 70,
      photographer: Math.floor(Math.random() * 30) + 60,
      videographer: Math.floor(Math.random() * 30) + 65,
      designer: Math.floor(Math.random() * 30) + 70,
    },
  };
}

interface PersonalityQuizProps {
  onComplete?: (result: PersonalityResult) => void;
  className?: string;
}

export function PersonalityQuiz({ onComplete, className }: PersonalityQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);

  // Load saved quiz result from localStorage on mount
  useState(() => {
    try {
      const saved = localStorage.getItem("colab-quiz-result");
      const savedAnswers = localStorage.getItem("colab-quiz-answers");
      if (saved) {
        setResult(JSON.parse(saved));
        setCurrentStep(quizQuestions.length);
      }
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch {
      // ignore
    }
  });

  const isComplete = currentStep >= quizQuestions.length;
  const currentQuestion = quizQuestions[currentStep];
  const progress = (Object.keys(answers).length / quizQuestions.length) * 100;

  function handleSelect(value: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    localStorage.setItem("colab-quiz-answers", JSON.stringify(newAnswers));

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const res = computeResult(newAnswers);
      setResult(res);
      localStorage.setItem("colab-quiz-result", JSON.stringify(res));
      onComplete?.(res);
    }
  }

  function handleReset() {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    localStorage.removeItem("colab-quiz-result");
    localStorage.removeItem("colab-quiz-answers");
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden", className)}>
      {/* Header */}
      <div className="gradient-primary px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-sm font-semibold">Collaboration Personality Quiz</h3>
        </div>
        <p className="mt-1 text-xs text-white/70">Discover your creative collaboration style</p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${result ? 100 : progress}%` }}
        />
      </div>

      <div className="p-6">
        {!result ? (
          <>
            {/* Question */}
            <p className="text-xs text-muted-foreground mb-1">
              Question {currentStep + 1} of {quizQuestions.length}
            </p>
            <p className="text-sm font-semibold text-card-foreground mb-4">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    answers[currentQuestion.id] === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-card-foreground hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <span>{option.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Result */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full gradient-primary">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-card-foreground">{result.type}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{result.description}</p>
            </div>

            {/* Traits */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {result.traits.map((trait) => (
                <Badge key={trait} variant="primary" size="sm">{trait}</Badge>
              ))}
            </div>

            {/* Match strengths */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Match Strength by Category</p>
              {Object.entries(result.matchStrength).map(([category, strength]) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-card-foreground capitalize">{category.replace("-", " ")}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-8">{strength}%</span>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={handleReset} className="mt-4 w-full">
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Quiz
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
