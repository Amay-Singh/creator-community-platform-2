"use client";

import { useState } from "react";
import { Sparkles, FileText, Image, Video, Music, Copy, RefreshCw, ThumbsUp, ThumbsDown, Star, Users, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiPortfolioGenerator } from "@/components/ai/ai-portfolio-generator";
import { cn } from "@/lib/utils";

type ContentType = "post" | "bio" | "script" | "portfolio" | "hashtags";

const contentTypes: { id: ContentType; label: string; icon: React.ElementType; description: string }[] = [
  { id: "post", label: "Social Post", icon: FileText, description: "Generate engaging social media posts" },
  { id: "bio", label: "Bio / About", icon: FileText, description: "Craft a compelling creator bio" },
  { id: "script", label: "Video Script", icon: Video, description: "Write scripts for your video content" },
  { id: "portfolio", label: "Portfolio Copy", icon: Image, description: "Describe your portfolio pieces" },
  { id: "hashtags", label: "Hashtags", icon: Music, description: "Generate relevant hashtags for reach" },
];

const toneOptions = ["Professional", "Casual", "Inspirational", "Witty", "Storytelling"];
const audienceOptions = ["General", "Industry Peers", "Fans / Followers", "Potential Clients", "Brand Partners"];

const mockOutputs: Record<ContentType, string> = {
  post: "🎨 Creating is not just what I do — it's who I am.\n\nEvery collaboration brings something new to life. This week I had the privilege of working with @alexrivera on a project that pushed both our creative boundaries.\n\nThe result? Something neither of us could have made alone. That's the magic of community.\n\n#CreatorCommunity #Collaboration #ArtistsUnite",
  bio: "Electronic music producer and sound designer based in Los Angeles. I blend ambient textures with hard-hitting beats to create immersive audio experiences. With 12+ collaborations and a growing community of fellow creators, I'm always looking for the next creative adventure. Let's make something extraordinary together.",
  script: "INTRO (0:00 - 0:15)\n[Camera: Close-up of hands on keyboard]\nNarrator: \"Every great collaboration starts with a single idea...\"\n\nACT 1 (0:15 - 1:00)\n[Camera: Wide shot of studio]\nNarrator: \"When Maya and I first connected on Colab, we didn't know our styles would mesh so perfectly.\"\n[B-roll: Studio sessions, laughing, creating]\n\nACT 2 (1:00 - 2:00)\n[Camera: Split screen of both creators working]\nNarrator: \"The process wasn't always smooth — but that's where the magic happens.\"",
  portfolio: "\"Urban Frequencies\" — A 6-track EP exploring the intersection of electronic music and urban photography. Each track is paired with a visual narrative captured in the streets of Los Angeles, creating an immersive audio-visual journey through the city's creative pulse. Produced in collaboration with photographer Alex Rivera.",
  hashtags: "#CreatorCommunity #MusicProducer #ElectronicMusic #Collaboration #IndieArtist #SoundDesign #StudioLife #CreativeProcess #ArtistCollab #MusicIsLife #ProducerLife #BeatMaker #AudioVisual #UrbanArt #CreativeCollective",
};

function SliderControl({ label, icon: Icon, value, onChange, min, max, step, displayValue }: {
  label: string; icon: React.ElementType; value: number; onChange: (v: number) => void; min: number; max: number; step: number; displayValue: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-card-foreground">{label}</span>
        </div>
        <span className="text-xs font-semibold text-primary">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-muted cursor-pointer accent-primary"
        aria-label={label}
      />
    </div>
  );
}

export default function AiStudioPage() {
  const [selectedType, setSelectedType] = useState<ContentType>("post");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("General");
  const [wordCount, setWordCount] = useState(150);
  const [creativity, setCreativity] = useState(70);
  const [output, setOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [feedbackSent, setFeedbackSent] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setQualityScore(null);
    setUserRating(0);
    setFeedbackSent(false);
    // TODO: Connect to AI backend API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setOutput(mockOutputs[selectedType]);
    // Simulate quality scoring
    setQualityScore(Math.floor(Math.random() * 15) + 82);
    setIsGenerating(false);
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  function handleFeedback(positive: boolean) {
    // TODO: Send feedback to backend
    setFeedbackSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white shadow-md">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Content Studio</h1>
          <p className="text-sm text-muted-foreground">Generate content with AI assistance tailored to your style</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-5">
          {/* Content Type */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Content Type</h3>
            <div className="space-y-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
                    selectedType === type.id
                      ? "bg-primary/10 border border-primary/30 text-primary"
                      : "border border-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  <type.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="text-[10px] opacity-70">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Tone</h3>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    tone === t
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Audience (P6.1) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              {audienceOptions.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    audience === a
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders (P6.1) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Configuration</h3>
            <SliderControl
              label="Word Count"
              icon={AlignLeft}
              value={wordCount}
              onChange={setWordCount}
              min={50}
              max={500}
              step={25}
              displayValue={`~${wordCount} words`}
            />
            <SliderControl
              label="Creativity"
              icon={Sparkles}
              value={creativity}
              onChange={setCreativity}
              min={10}
              max={100}
              step={5}
              displayValue={`${creativity}%`}
            />
          </div>
        </div>

        {/* Right: Input & Output */}
        <div className="lg:col-span-2 space-y-5">
          {/* Prompt Input */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Your Prompt</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe what you want to create... (e.g., "Write a ${contentTypes.find((t) => t.id === selectedType)?.label.toLowerCase()} about my latest collaboration")`}
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              aria-label="AI generation prompt"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="primary" size="sm">{contentTypes.find((t) => t.id === selectedType)?.label}</Badge>
                <Badge variant="outline" size="sm">{tone}</Badge>
                <Badge variant="outline" size="sm"><Users className="h-3 w-3 mr-0.5" />{audience}</Badge>
                <Badge variant="outline" size="sm">~{wordCount}w</Badge>
              </div>
              <Button variant="gradient" onClick={handleGenerate} isLoading={isGenerating}>
                <Sparkles className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>

          {/* Output */}
          {output && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-card-foreground">Generated Content</h3>
                  {/* Quality Score (P6.1) */}
                  {qualityScore !== null && (
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        qualityScore >= 90 ? "bg-secondary-emerald/10 text-secondary-emerald" :
                        qualityScore >= 75 ? "bg-primary/10 text-primary" :
                        "bg-secondary-orange/10 text-secondary-orange"
                      )}>
                        <Star className="h-3 w-3" />
                        {qualityScore}/100
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-line">{output}</p>
              </div>

              {/* User Feedback (P6.1) */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Rate this output:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="transition-transform hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className={cn("h-4 w-4", userRating >= star ? "fill-secondary-orange text-secondary-orange" : "text-muted-foreground/30")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!feedbackSent ? (
                    <>
                      <button
                        onClick={() => handleFeedback(true)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary-emerald/10 hover:text-secondary-emerald transition-colors"
                        aria-label="Helpful"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                      </button>
                      <button
                        onClick={() => handleFeedback(false)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary-rose/10 hover:text-secondary-rose transition-colors"
                        aria-label="Not helpful"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> Not helpful
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-secondary-emerald">Thanks for your feedback!</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* P6.2: AI Portfolio Generator */}
      <AiPortfolioGenerator />
    </div>
  );
}
