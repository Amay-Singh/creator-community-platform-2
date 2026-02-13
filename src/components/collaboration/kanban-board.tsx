"use client";

import { useState } from "react";
import { Plus, GripVertical, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  assignee?: { name: string; avatar?: string };
  priority: "high" | "medium" | "low";
  dueDate?: string;
  labels: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const priorityStyles: Record<string, string> = {
  high: "bg-secondary-rose/10 text-secondary-rose",
  medium: "bg-secondary-orange/10 text-secondary-orange",
  low: "bg-secondary-emerald/10 text-secondary-emerald",
};

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-muted-foreground",
    tasks: [
      {
        id: "t1",
        title: "Design album cover concepts",
        assignee: { name: "Maya Chen" },
        priority: "high",
        dueDate: "Feb 15",
        labels: ["Design"],
      },
      {
        id: "t2",
        title: "Write song lyrics for track 3",
        assignee: { name: "Aria Patel" },
        priority: "medium",
        labels: ["Writing"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-primary",
    tasks: [
      {
        id: "t3",
        title: "Record vocals for intro",
        assignee: { name: "Aria Patel" },
        priority: "high",
        dueDate: "Feb 14",
        labels: ["Recording"],
      },
      {
        id: "t4",
        title: "Edit behind-the-scenes footage",
        assignee: { name: "Sam Taylor" },
        priority: "medium",
        labels: ["Video"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-secondary-orange",
    tasks: [
      {
        id: "t5",
        title: "Mix track 1 master",
        assignee: { name: "Maya Chen" },
        priority: "high",
        labels: ["Audio", "Mixing"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-secondary-emerald",
    tasks: [
      {
        id: "t6",
        title: "Finalize project brief",
        assignee: { name: "Jordan Lee" },
        priority: "low",
        labels: ["Planning"],
      },
    ],
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromColumn: string } | null>(null);

  function handleDragStart(taskId: string, fromColumn: string) {
    setDraggedTask({ taskId, fromColumn });
  }

  function handleDrop(toColumnId: string) {
    if (!draggedTask) return;
    if (draggedTask.fromColumn === toColumnId) {
      setDraggedTask(null);
      return;
    }

    setColumns((prev) => {
      const fromCol = prev.find((c) => c.id === draggedTask.fromColumn);
      const task = fromCol?.tasks.find((t) => t.id === draggedTask.taskId);
      if (!task) return prev;

      return prev.map((col) => {
        if (col.id === draggedTask.fromColumn) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.taskId) };
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      });
    });
    setDraggedTask(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-muted/30"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {column.tasks.length}
              </span>
            </div>
            <button className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label={`Add task to ${column.title}`}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Tasks */}
          <div className="flex flex-1 flex-col gap-2 px-3 pb-3">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id, column.id)}
                className="cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-200 hover:shadow-card active:cursor-grabbing active:shadow-lg"
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {task.labels.map((label) => (
                        <Badge key={label} variant="outline" size="sm" className="text-[10px]">
                          {label}
                        </Badge>
                      ))}
                      <Badge variant="outline" size="sm" className={cn("text-[10px]", priorityStyles[task.priority])}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {task.assignee && (
                        <div className="flex items-center gap-1.5">
                          <Avatar alt={task.assignee.name} src={task.assignee.avatar} size="sm" />
                          <span className="text-[10px] text-muted-foreground">{task.assignee.name.split(" ")[0]}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
