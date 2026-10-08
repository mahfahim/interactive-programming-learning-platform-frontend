// src/app/(dashboard)/student/page.tsx
"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/modules/course/shared/CourseCard";
import { CourseSkeleton } from "@/components/modules/course/shared/CourseSkeleton";
import { Button } from "@/components/ui/button";
import { useGetCourses } from "@/hooks/course.hook";
import type { ICourse } from "@/types";

export default function StudentDashboardPage() {
  const { data: response, isLoading } = useGetCourses({ limit: 4 });
  const courses = (response?.data as unknown as ICourse[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your learning journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/student/my-courses">My Courses</Link>
          </Button>
          <Button asChild>
            <Link href="/courses">Browse Catalog</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Recommended Courses
          </h2>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/courses">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <CourseSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                detailUrlPrefix="/courses"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
