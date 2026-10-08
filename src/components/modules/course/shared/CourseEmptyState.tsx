// src/components/modules/course/CourseEmptyState.tsx
import { BookOpen } from "lucide-react";

interface CourseEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function CourseEmptyState({
  title = "No courses found",
  description = "We couldn't find any courses matching your request.",
  action,
}: CourseEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed my-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
