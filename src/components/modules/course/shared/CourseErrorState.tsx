// src/components/modules/course/CourseErrorState.tsx
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function CourseErrorState({
  message = "An error occurred while loading courses.",
  onRetry,
}: CourseErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-destructive/20 bg-destructive/5 text-center my-6">
      <AlertCircle className="h-10 w-10 text-destructive mb-3" />
      <h3 className="text-lg font-semibold text-destructive mb-1">
        Failed to load content
      </h3>
      <p className="text-muted-foreground max-w-md text-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Retry
        </Button>
      )}
    </div>
  );
}
