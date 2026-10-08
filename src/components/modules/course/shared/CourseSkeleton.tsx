// src/components/modules/course/CourseSkeleton.tsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseSkeleton({ count = 6 }: { count?: number }) {
  const skeletonItems = Array.from(
    { length: count },
    (_, i) => `course-skeleton-${i + 1}`,
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletonItems.map((id) => (
        <Card
          key={id}
          className="overflow-hidden flex flex-col justify-between"
        >
          <div>
            <Skeleton className="h-48 w-full" />
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </div>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-9 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
