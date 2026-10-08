"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ModuleErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ModuleErrorState({
  message = "Failed to load modules. Please check your connection and try again.",
  onRetry,
}: ModuleErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      className="my-4 border-destructive/50 bg-destructive/10"
    >
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-semibold text-base">
        Error Loading Modules
      </AlertTitle>
      <AlertDescription className="mt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="self-start sm:self-auto gap-2 border-destructive/30 hover:bg-destructive/20 text-destructive dark:text-destructive-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
