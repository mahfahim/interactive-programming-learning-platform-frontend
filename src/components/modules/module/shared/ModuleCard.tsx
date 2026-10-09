"use client";

import { BookOpen, Edit, Eye, MoreVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IModule } from "@/types";

interface ModuleCardProps {
  module: IModule;
  canManage?: boolean;
  courseId?: string;
  superModuleId?: string;
  isInstructor?: boolean;
  isAdmin?: boolean;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
  onView?: (module: IModule) => void;
}

export function ModuleCard({
  module,
  canManage = false,
  courseId,
  superModuleId,
  isInstructor = false,
  isAdmin = false,
  onEdit,
  onDelete,
  onView,
}: ModuleCardProps) {
  const lessonCount = Array.isArray(module.lessons) ? module.lessons.length : 0;

  // Dynamic Route Prefix Logic
  const basePath = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/admin";

  // Dynamic Lessons base route
  const lessonsBaseUrl =
    courseId && superModuleId
      ? `${basePath}/courses/${courseId}/super-modules/${superModuleId}/modules/${module.id}/lessons`
      : null;

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border/70 bg-card hover:border-primary/40 transition-all shadow-sm">
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <Badge
          variant="outline"
          className="font-mono text-xs px-2 py-0.5 shrink-0 bg-muted/40"
        >
          #{module.displayOrder}
        </Badge>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {module.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {canManage && lessonsBaseUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs gap-1 hidden md:inline-flex"
          >
            <Link href={`${lessonsBaseUrl}/create`}>
              <Plus className="h-3.5 w-3.5" />
              Add Lesson
            </Link>
          </Button>
        )}

        {onView && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView(module)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View module</span>
          </Button>
        )}

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Module options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {onView && (
                <DropdownMenuItem onClick={() => onView(module)}>
                  <Eye className="h-4 w-4 mr-2" /> View Details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(module)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Module
                </DropdownMenuItem>
              )}
              {lessonsBaseUrl && (
                <DropdownMenuItem asChild>
                  <Link href={lessonsBaseUrl}>
                    <BookOpen className="h-4 w-4 mr-2" /> Manage Lessons
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(module)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}