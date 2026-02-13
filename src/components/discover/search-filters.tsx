"use client";

import { useState, startTransition } from "react";
import { Search, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CreatorCategory } from "@/types";

const categories: { value: CreatorCategory; label: string }[] = [
  { value: "musician", label: "Musician" },
  { value: "visual-artist", label: "Visual Artist" },
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "writer", label: "Writer" },
  { value: "dancer", label: "Dancer" },
  { value: "influencer", label: "Influencer" },
  { value: "designer", label: "Designer" },
];

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface SearchFiltersProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categories: CreatorCategory[];
  experience: string[];
  location: string;
}

export function SearchFilters({ view, onViewChange, onSearch, onFilterChange }: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    experience: [],
    location: "",
  });

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    startTransition(() => {
      onSearch(value);
    });
  }

  function toggleCategory(cat: CreatorCategory) {
    const updated = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    const newFilters = { ...filters, categories: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  function toggleExperience(level: string) {
    const updated = filters.experience.includes(level)
      ? filters.experience.filter((e) => e !== level)
      : [...filters.experience, level];
    const newFilters = { ...filters, experience: updated };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }

  function clearFilters() {
    const cleared: FilterState = { categories: [], experience: [], location: "" };
    setFilters(cleared);
    onFilterChange(cleared);
  }

  const activeFilterCount = filters.categories.length + filters.experience.length + (filters.location ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar + Controls */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, skill, or location..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            aria-label="Search creators"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? "primary" : "outline"}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-rose text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <div className="flex rounded-xl border border-border">
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-l-xl transition-colors",
              view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-r-xl border-l border-border transition-colors",
              view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            )}
            aria-label="List view"
            aria-pressed={view === "list"}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-card-foreground">Filter Creators</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    filters.categories.includes(cat.value)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</p>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => toggleExperience(level)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    filters.experience.includes(level)
                      ? "bg-secondary-purple text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-secondary-purple/10 hover:text-secondary-purple"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => {
                const newFilters = { ...filters, location: e.target.value };
                setFilters(newFilters);
                onFilterChange(newFilters);
              }}
              placeholder="City, country..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Filter by location"
            />
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
              {filters.categories.map((cat) => (
                <Badge key={cat} variant="primary" size="sm" className="gap-1">
                  {cat}
                  <button onClick={() => toggleCategory(cat)} aria-label={`Remove ${cat} filter`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.experience.map((exp) => (
                <Badge key={exp} variant="secondary" size="sm" className="gap-1">
                  {exp}
                  <button onClick={() => toggleExperience(exp)} aria-label={`Remove ${exp} filter`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
