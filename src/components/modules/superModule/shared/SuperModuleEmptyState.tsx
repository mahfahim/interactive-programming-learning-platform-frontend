"use client";

import { FolderPlus, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuperModuleEmptyStateProps {
  onCreateClick?: () => void;
  isInstructor?: boolean;
}

export function SuperModuleEmptyState({
  onCreateClick,
  isInstructor = false,
}: SuperModuleEmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Layers className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        No Super Modules Found
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {isInstructor
          ? "Start structuring this course by creating your first Super Module layer to group related modules and lessons."
          : "The curriculum structure for this course is currently being prepared. Check back soon!"}
      </p>
      {isInstructor && onCreateClick && (
        <Button onClick={onCreateClick} className="mt-6 gap-2">
          <FolderPlus className="h-4 w-4" />
          Create First Super Module
        </Button>
      )}
    </div>
  );
}
