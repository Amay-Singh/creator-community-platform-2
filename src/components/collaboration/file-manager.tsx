"use client";

import { useState, useCallback } from "react";
import { Upload, File, Image as ImageIcon, Video, FileText, Trash2, Download, Eye, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProjectFile {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio" | "other";
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  previewUrl?: string;
}

const mockFiles: ProjectFile[] = [
  { id: "f1", name: "album-cover-v3.png", type: "image", size: "4.2 MB", uploadedBy: "Maya Chen", uploadedAt: "2h ago", version: 3, previewUrl: "https://picsum.photos/seed/f1/400/400" },
  { id: "f2", name: "track3-master.wav", type: "audio", size: "48 MB", uploadedBy: "Aria Patel", uploadedAt: "5h ago", version: 2 },
  { id: "f3", name: "project-brief.pdf", type: "document", size: "1.1 MB", uploadedBy: "Jordan Lee", uploadedAt: "1d ago", version: 1 },
  { id: "f4", name: "bts-footage-edit2.mp4", type: "video", size: "87 MB", uploadedBy: "Sam Taylor", uploadedAt: "2d ago", version: 2 },
  { id: "f5", name: "color-palette.png", type: "image", size: "820 KB", uploadedBy: "Jordan Lee", uploadedAt: "3d ago", version: 1, previewUrl: "https://picsum.photos/seed/f5/400/400" },
];

const fileIcons: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  document: FileText,
  audio: File,
  other: File,
};

interface FileManagerProps {
  projectId: string;
  className?: string;
}

export function FileManager({ projectId, className }: FileManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    // TODO: Connect to backend upload API
    const newFiles: ProjectFile[] = droppedFiles.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : f.type.startsWith("video/") ? "video" : f.type.includes("pdf") ? "document" : "other",
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: "You",
      uploadedAt: "Just now",
      version: 1,
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  }, []);

  function handleDelete(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMenuOpen(null);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/30"
        )}
      >
        <Upload className={cn("h-8 w-8 mb-2", isDragOver ? "text-primary" : "text-muted-foreground")} />
        <p className="text-sm font-medium text-card-foreground">
          {isDragOver ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Up to 100MB per file · Images, videos, documents, audio</p>
        <Button variant="outline" size="sm" className="mt-3">
          <Upload className="h-3.5 w-3.5" />
          Browse Files
        </Button>
      </div>

      {/* File list */}
      <div className="space-y-2">
        {files.map((file) => {
          const Icon = fileIcons[file.type] || File;
          return (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:shadow-sm"
            >
              {/* Preview thumbnail or icon */}
              {file.previewUrl ? (
                <button
                  onClick={() => setPreviewFile(file)}
                  className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"
                >
                  <img src={file.previewUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{file.size}</span>
                  <span>·</span>
                  <span>{file.uploadedBy}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {file.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Version badge */}
              <Badge variant="outline" size="sm" className="shrink-0">
                v{file.version}
              </Badge>

              {/* Actions */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === file.id ? null : file.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="File actions"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {menuOpen === file.id && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-xl border border-border bg-card p-1 shadow-lg">
                    {file.previewUrl && (
                      <button
                        onClick={() => { setPreviewFile(file); setMenuOpen(null); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-card-foreground hover:bg-muted"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    )}
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-card-foreground hover:bg-muted">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-secondary-rose hover:bg-secondary-rose/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      {previewFile && previewFile.previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative max-h-[80vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -right-3 -top-3 rounded-full bg-card p-1.5 shadow-lg"
              aria-label="Close preview"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <img
              src={previewFile.previewUrl}
              alt={previewFile.name}
              className="max-h-[80vh] rounded-xl object-contain"
            />
            <p className="mt-2 text-center text-sm text-white">{previewFile.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
