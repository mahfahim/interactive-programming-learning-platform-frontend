"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMyEnrolledCourses } from "@/hooks/enrollment.hook";
import { BookOpen, PlayCircle, Award, AlertCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EnrolledCourseItem {
  enrollmentId: string;
  enrolledAt: string;
  isPaid: boolean;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  course: {
    id: string;
    title: string;
    slug: string;
    coverImageUrl?: string;
  };
}

export const MyEnrolledCourses = () => {
  const { data, isLoading, isError } = useGetMyEnrolledCourses();
  const enrolledCourses = (data?.data as EnrolledCourseItem[]) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="overflow-hidden">
            <Skeleton className="h-44 w-full rounded-none" />
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load your enrolled courses. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Enrolled Courses Yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore our catalog and start learning today!
        </p>
        <Button asChild className="mt-6">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {enrolledCourses.map((item) => (
        <Card
          key={item.enrollmentId}
          className="group flex flex-col overflow-hidden transition-all hover:shadow-md"
        >
          {/* Cover Image */}
          <div className="relative h-44 w-full bg-muted">
            {item.course.coverImageUrl ? (
              <Image
                src={item.course.coverImageUrl}
                alt={item.course.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <BookOpen className="h-10 w-10" />
              </div>
            )}
          </div>

          {/* Card Body */}
          <CardContent className="flex flex-1 flex-col p-5">
            <CardTitle className="line-clamp-2 text-base font-bold transition-colors group-hover:text-primary">
              {item.course.title}
            </CardTitle>

            <div className="mt-auto space-y-3 pt-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span>{item.progressPercentage}%</span>
              </div>

              <Progress value={item.progressPercentage} className="h-2" />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {item.completedLessons} / {item.totalLessons} Lessons
                </span>
                {item.progressPercentage === 100 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 border-transparent bg-emerald-500/10 font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                  >
                    <Award className="h-3.5 w-3.5" /> Completed
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>

          {/* Action Footer */}
          <CardFooter className="p-5 pt-0">
            <Button asChild className="w-full gap-2">
              <Link href={`/learn/${item.course.slug}`}>
                <PlayCircle className="h-4 w-4" />
                {item.progressPercentage > 0 ? "Continue Learning" : "Start Course"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};