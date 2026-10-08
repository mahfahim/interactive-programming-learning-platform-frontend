"use client";

import { BookOpen, Edit, Hash, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { IModule } from "@/types";

interface ModuleDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: IModule;
  canManage?: boolean;
  onEdit?: (module: IModule) => void;
}

export function ModuleDetails({
  open,
  onOpenChange,
  module,
  canManage = false,
  onEdit,
}: ModuleDetailsProps) {
  const lessons =
    (module.lessons as Array<{ id?: string; title?: string }>) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Order #{module.displayOrder}
              </Badge>
              <DialogTitle className="text-lg font-bold">
                {module.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Hash className="h-3.5 w-3.5" /> Display Order
              </span>
              <span className="font-semibold text-foreground">
                {module.displayOrder}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" /> Total Lessons
              </span>
              <span className="font-semibold text-foreground">
                {lessons.length}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
              Attached Lessons ({lessons.length})
            </h4>
            {lessons.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No lessons in this module.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id || idx}
                    className="p-2 rounded border border-border/40 text-xs font-medium flex items-center gap-2 bg-card"
                  >
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>{lesson.title || `Lesson ${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {canManage && onEdit && (
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit(module);
              }}
              className="gap-1.5"
            >
              <Edit className="h-4 w-4" /> Edit Module
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
