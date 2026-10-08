"use client";

import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleHeaderProps {
  title?: string;
  totalModules?: number;
  canManage?: boolean;
  onCreateClick?: () => void;
}

export function ModuleHeader({
  title = "Modules",
  totalModules = 0,
  canManage = false,
  onCreateClick,
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {totalModules}
        </span>
      </div>
      {canManage && onCreateClick && (
        <Button
          size="sm"
          onClick={onCreateClick}
          className="gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      )}
    </div>
  );
}
