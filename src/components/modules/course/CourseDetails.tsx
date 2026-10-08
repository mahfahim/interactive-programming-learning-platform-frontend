// src/components/modules/course/CourseDetails.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseById } from "@/hooks/course.hook";
import type { ICourse } from "@/types";
import { CourseDescription } from "./shared/CourseDescription";
import { CourseErrorState } from "./shared/CourseErrorState";
import { CourseHero } from "./shared/CourseHero";
import { CourseStructure } from "./shared/CourseStructure";
import { LearningOutcomes } from "./shared/LearningOutcomes";
import { Prerequisites } from "./shared/Prerequisites";

interface CourseDetailsProps {
  courseId: string;
  onEnroll?: () => void;
  enrollLabel?: string;
}

export function CourseDetails({
  courseId,
  onEnroll,
  enrollLabel,
}: CourseDetailsProps) {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCourseById(courseId);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto py-6">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <CourseErrorState
        message={
          (error as Error)?.message || "Course details could not be found."
        }
        onRetry={refetch}
      />
    );
  }

  const course = response.data as unknown as ICourse;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      <CourseHero
        course={course}
        onEnroll={onEnroll}
        enrollLabel={enrollLabel}
      />
      <LearningOutcomes outcomes={course.description?.learningOutcomes} />
      <CourseDescription
        fullDescription={course.description?.fullDescription}
      />
      <Prerequisites prerequisites={course.description?.prerequisites} />
      <CourseStructure superModules={course.superModules} />
    </div>
  );
}
