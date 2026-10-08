// src/components/modules/superModule/shared/SuperModuleCard.tsx
"use client";

import { BookOpen, Edit, MoreVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ISuperModule } from "@/types";

interface SuperModuleCardProps {
  superModule: ISuperModule;
  courseId?: string;
  isInstructor?: boolean;
  onEdit?: (superModule: ISuperModule) => void;
  onDelete?: (superModule: ISuperModule) => void;
  onAddModule?: (superModuleId: string) => void;
}

export function SuperModuleCard({
  superModule,
  courseId,
  isInstructor = false,
  onEdit,
  onDelete,
  onAddModule,
}: SuperModuleCardProps) {
  const moduleCount = superModule.modules?.length || 0;
  const activeCourseId = courseId || superModule.courseId;

  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card transition-all hover:border-primary/40 hover:shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="flex items-start space-x-3">
          <Badge
            variant="secondary"
            className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-md font-mono text-xs font-semibold text-foreground bg-muted"
          >
            #{superModule.displayOrder}
          </Badge>

          <div>
            {/* Super Module Details Page-এ নেওয়ার লিঙ্ক */}
            <Link
              href={`/admin/courses/${activeCourseId}/super-modules/${superModule.id}`}
            >
              <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors hover:underline cursor-pointer">
                {superModule.title}
              </h3>
            </Link>
            {superModule.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {superModule.description}
              </p>
            )}
          </div>
        </div>

        {isInstructor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {onAddModule && (
                <DropdownMenuItem
                  onClick={() => onAddModule(superModule.id)}
                  className="gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  Add Module
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(superModule)}
                  className="gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  Edit Super Module
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(superModule)}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <Link
            href={`/admin/courses/${activeCourseId}/super-modules/${superModule.id}`}
            className="flex items-center gap-1.5 font-medium hover:text-primary cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>
              {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
            </span>
          </Link>

          {isInstructor && onAddModule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddModule(superModule.id)}
              className="h-7 text-xs gap-1 border-dashed hover:border-primary/50"
            >
              <Plus className="h-3 w-3" />
              Add Module
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
