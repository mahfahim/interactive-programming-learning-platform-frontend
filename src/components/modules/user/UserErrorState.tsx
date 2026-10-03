"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UserErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function UserErrorState({
  message = "Failed to load user profile details.",
  onRetry,
}: UserErrorStateProps) {
  return (
    <Card className="max-w-md mx-auto my-12 border shadow-sm">
      <CardContent className="flex flex-col items-center text-center p-8 space-y-3">
        <div className="p-3 bg-destructive/10 text-destructive rounded-full">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold">Unable to Fetch User Information</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2 gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
