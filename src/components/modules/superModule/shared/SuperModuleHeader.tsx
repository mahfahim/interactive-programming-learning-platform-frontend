"use client";

import { FolderPlus, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SuperModuleHeaderProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  onCreateClick?: () => void;
  isInstructor?: boolean;
}

export function SuperModuleHeader({
  title = "Super Modules Curriculum",
  description = "Organize course content into high-level foundational modules.",
  searchTerm = "",
  onSearchChange,
  viewMode = "list",
  onViewModeChange,
  onCreateClick,
  isInstructor = false,
}: SuperModuleHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange && (
          <div className="relative min-w-50 flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter super modules..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        )}

        {onViewModeChange && (
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 px-2.5 text-xs"
            >
              <List className="h-3.5 w-3.5 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 px-2.5 text-xs"
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-1" />
              Cards
            </Button>
          </div>
        )}

        {isInstructor && onCreateClick && (
          <Button onClick={onCreateClick} size="sm" className="h-9 gap-1.5">
            <FolderPlus className="h-4 w-4" />
            Add Super Module
          </Button>
        )}
      </div>
    </div>
  );
}
