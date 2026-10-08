"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export function ModuleSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {SKELETON_KEYS.map((key) => (
        <Card key={key} className="border border-border/60 shadow-sm">
          <CardHeader className="p-4 sm:p-5 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-5 w-1/3 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-5 pb-4 pt-0">
            <div className="pl-15 space-y-2">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
