"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetLessonById } from "@/hooks/lesson.hook";
import { LessonType } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Sub-components
import { ArticleLesson, ArticleDataDetails } from "./student-shared/ArticleLesson";
import { VideoLesson } from "./student-shared/VideoLesson";
import { AssignmentLesson, AssignmentDataDetails } from "./student-shared/AssignmentLesson";
import { CodingLesson, CodingDataDetails } from "./student-shared/CodingLesson";
import { QuizLesson, QuizDataDetails } from "./student-shared/QuizLesson";

export function StudentLessonDetails({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { data: response, isLoading } = useGetLessonById(lessonId);
  const lesson = response?.data;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-3 border-b pb-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Lesson Not Found</CardTitle>
            <CardDescription>
              The requested lesson could not be located or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Navigation Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <Badge variant="secondary" className="uppercase font-semibold text-[11px]">
            {lesson.lessonType}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {lesson.lessonType === LessonType.ARTICLE && (
            <ArticleLesson articleData={lesson.article as ArticleDataDetails} />
          )}

          {lesson.lessonType === LessonType.VIDEO && (
            <VideoLesson
              videoData={lesson.video as { videoUrl?: string; durationSeconds?: number }}
              title={lesson.title}
            />
          )}

          {lesson.lessonType === LessonType.ASSIGNMENT && (
            <AssignmentLesson
              assignmentData={lesson.assignment as AssignmentDataDetails}
              fallbackTitle={lesson.title}
            />
          )}

          {lesson.lessonType === LessonType.CODING && (
            <CodingLesson codingData={lesson.coding as CodingDataDetails} />
          )}

          {lesson.lessonType === LessonType.QUIZ && (
            <QuizLesson quizData={lesson.quiz as QuizDataDetails} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}