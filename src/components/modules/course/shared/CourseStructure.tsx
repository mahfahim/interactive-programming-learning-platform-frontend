// src/components/modules/course/CourseStructure.tsx
import { BookOpen } from "lucide-react";
import type { ISuperModule } from "@/types";

interface CourseStructureProps {
  superModules?: ISuperModule[];
}

export function CourseStructure({ superModules }: CourseStructureProps) {
  if (!superModules || superModules.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">Course Content</h2>
        <div className="p-6 rounded-lg border border-dashed text-center text-muted-foreground bg-muted/20">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
          <p className="font-medium">Course content is being prepared.</p>
          <p className="text-xs text-muted-foreground">
            Check back soon for updated modules and lessons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Course Content</h2>
      <div className="space-y-3">
        {superModules.map((sm, index) => (
          <div
            key={sm.id || index}
            className="p-4 rounded-lg border bg-card space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">
                Module {index + 1}: {sm.title}
              </h3>
              {sm.modules && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  {sm.modules.length} Topics
                </span>
              )}
            </div>
            {sm.description && (
              <p className="text-sm text-muted-foreground">{sm.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
