"use client";

import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleEmptyStateProps {
  canManage?: boolean;
  onCreateClick?: () => void;
}

export function ModuleEmptyState({
  canManage = false,
  onCreateClick,
}: ModuleEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-border/80 bg-muted/20 my-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted shadow-inner mb-4">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        No Modules Found
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">
        {canManage
          ? "There are no modules created for this section yet. Get started by creating your first module."
          : "No modules have been published for this section."}
      </p>
      {canManage && onCreateClick && (
        <Button onClick={onCreateClick} size="sm" className="mt-5 gap-2">
          <Plus className="h-4 w-4" />
          Create First Module
        </Button>
      )}
    </div>
  );
}
