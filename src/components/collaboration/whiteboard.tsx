"use client";

import { useState, useRef, useCallback } from "react";
import { Pencil, Square, Circle, Type, Eraser, Undo2, Redo2, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tool = "pen" | "rectangle" | "circle" | "text" | "eraser";

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "rectangle", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F97316", "#F43F5E", "#000000", "#FFFFFF"];

interface WhiteboardProps {
  projectId: string;
  className?: string;
}

export function Whiteboard({ projectId, className }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>("pen");
  const [activeColor, setActiveColor] = useState("#3B82F6");
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = getCtx();
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPos.current = { x, y };

    if (activeTool === "pen" || activeTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx || !lastPos.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "pen") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (activeTool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPos.current = { x, y };
  }

  function endDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx || !lastPos.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const start = lastPos.current;

    if (activeTool === "rectangle") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(start.x, start.y, x - start.x, y - start.y);
    } else if (activeTool === "circle") {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const rx = Math.abs(x - start.x) / 2;
      const ry = Math.abs(y - start.y) / 2;
      const cx = Math.min(start.x, x) + rx;
      const cy = Math.min(start.y, y) + ry;
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (activeTool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        ctx.font = "16px Inter, sans-serif";
        ctx.fillStyle = activeColor;
        ctx.fillText(text, x, y);
      }
    }

    setIsDrawing(false);
    lastPos.current = null;
  }

  function handleClear() {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  function handleExport() {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-card overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        {/* Tools */}
        <div className="flex gap-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "rounded-lg p-2 transition-colors",
                activeTool === tool.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-label={tool.label}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Colors */}
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-transform",
                activeColor === color ? "border-foreground scale-110" : "border-transparent hover:scale-105"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>

        <div className="mx-2 h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" onClick={handleClear}>
          <Eraser className="h-3.5 w-3.5" /> Clear
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={900}
        height={500}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        className="w-full cursor-crosshair bg-white"
        aria-label="Whiteboard canvas"
      />
    </div>
  );
}
