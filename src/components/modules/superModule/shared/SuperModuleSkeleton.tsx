"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SuperModuleSkeletonProps {
  count?: number;
}

export function SuperModuleSkeleton({ count = 3 }: SuperModuleSkeletonProps) {
  const items = Array.from(
    { length: count },
    (_, i) => `super-module-skeleton-${i}`,
  );

  return (
    <div className="space-y-4">
      {items.map((id) => (
        <Card key={id} className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-7 w-10 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="ml-13 space-y-2 border-l-2 border-muted pl-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
