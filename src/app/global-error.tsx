"use client"; // Error components must be Client Components

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Oops! Something went wrong in the root level
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              An unexpected critical error has occurred. We have been notified and are working to fix the issue.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button onClick={() => reset()} variant="default">
                Try again
              </Button>
              <Button onClick={() => window.location.href = "/"} variant="outline">
                Go back Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}