"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EnrollmentModal } from "@/components/modules/enrollment/EnrollmentModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyEnrolledCourses } from "@/hooks/enrollment.hook";
import { useGetLessonById, useUpdateLessonProgress } from "@/hooks/lesson.hook";
import { LessonType } from "@/types";

// Sub-components
import {
  type ArticleDataDetails,
  ArticleLesson,
} from "./student-shared/ArticleLesson";
import {
  type AssignmentDataDetails,
  AssignmentLesson,
} from "./student-shared/AssignmentLesson";
import {
  type CodingDataDetails,
  CodingLesson,
} from "./student-shared/CodingLesson";
import { type QuizDataDetails, QuizLesson } from "./student-shared/QuizLesson";
import { VideoLesson } from "./student-shared/VideoLesson";

interface EnrolledCourseItem {
  enrollmentId: string;
  enrolledAt: string;
  isPaid: boolean;
  course: {
    id: string;
    title: string;
    slug: string;
    coverImageUrl?: string;
  };
}

export function StudentLessonDetails({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 1. Fetch lesson details
  const { data: response, isLoading: isLessonLoading } =
    useGetLessonById(lessonId);
  const lesson = response?.data;

  // 2. Fetch user's enrolled courses
  const { data: enrolledResponse, isLoading: isEnrollmentLoading } =
    useGetMyEnrolledCourses();
  const enrolledCourses =
    (enrolledResponse?.data as EnrolledCourseItem[]) || [];

  // Sync completion state from API response
  useEffect(() => {
    if (lesson?.isCompleted !== undefined) {
      setIsCompleted(lesson.isCompleted);
    }
  }, [lesson?.isCompleted]);

  // 3. Progress Update Mutation (অটো-রাউটিং যুক্ত করা হয়েছে)
  const { mutate: toggleProgress, isPending: isUpdatingProgress } =
    useUpdateLessonProgress({
      onSuccess: () => {
        const willBeCompleted = !isCompleted;
        setIsCompleted(willBeCompleted);

        // 🟢 লেসন কমপ্লিট হলে এবং পরের লেসন থাকলে অটো রাউট হবে
        if (willBeCompleted) {
          if (lesson?.nextLessonId) {
            router.push(`/dashboard/student/lessons/${lesson.nextLessonId}`);
          } else {
            // যদি কোর্সের শেষ লেসন হয়
            alert(
              "Congratulations! You have completed all lessons in this course!",
            );
          }
        }
      },
    });

  const isLoading = isLessonLoading || isEnrollmentLoading;

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
              The requested lesson could not be located or may have been
              removed.
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

  const courseId =
    lesson.module?.superModule?.courseId ||
    lesson.module?.superModule?.course?.id ||
    "";
  const courseTitle =
    lesson.module?.superModule?.course?.title || "Course Content";
  const coursePrice = Number(lesson.module?.superModule?.course?.price || 0);

  const isEnrolled = enrolledCourses.some(
    (item) => item.course?.id === courseId,
  );

  // 🟢 Access Locks
  const isProLocked = lesson.isPro && !isEnrolled;
  const isSequentiallyLocked = lesson.isLocked ?? false;

  const rawCoding = lesson.coding as unknown as CodingDataDetails & {
    id?: string;
  };
  const codingData: CodingDataDetails | null = rawCoding
    ? {
        ...rawCoding,
        id: String(rawCoding.id || ""),
      }
    : null;

  const handleToggleComplete = () => {
    toggleProgress({
      id: lessonId,
      payload: { isCompleted: !isCompleted },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="uppercase font-semibold text-[11px]"
              >
                {lesson.lessonType}
              </Badge>

              {lesson.isPro && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 uppercase font-semibold text-[11px]">
                  <Sparkles className="w-3 h-3" /> PRO
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              {lesson.title}
            </h1>
          </div>
        </div>
      </div>

      {/* 🔴 1. Sequential Lock Banner (আগের লেসন না দেখলে এটি দেখাবে) */}
      {isSequentiallyLocked ? (
        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10 shadow-md">
          <CardContent className="pt-8 pb-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Lesson Locked
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You must complete the previous lesson before you can access this
                content.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back to Previous Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : /* 🟡 2. Pro Paywall Lock Banner (এনরোল না থাকলে এটি দেখাবে) */
      isProLocked ? (
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10 shadow-md">
          <CardContent className="pt-8 pb-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Pro Lesson Locked
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This lesson is exclusively available for enrolled students in{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  "{courseTitle}"
                </span>
                . Enroll now to gain instant access.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Enroll Now to Unlock
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 🟢 3. Main Unlocked Content */
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            {lesson.lessonType === LessonType.ARTICLE && (
              <ArticleLesson
                articleData={lesson.article as ArticleDataDetails}
              />
            )}

            {lesson.lessonType === LessonType.VIDEO && (
              <VideoLesson
                videoData={
                  lesson.video as {
                    videoUrl?: string;
                    durationSeconds?: number;
                  }
                }
                title={lesson.title}
              />
            )}

            {lesson.lessonType === LessonType.ASSIGNMENT && (
              <AssignmentLesson
                lessonId={lessonId}
                assignmentData={lesson.assignment as AssignmentDataDetails}
                fallbackTitle={lesson.title}
              />
            )}

            {lesson.lessonType === LessonType.CODING && (
              <CodingLesson codingData={codingData} />
            )}

            {lesson.lessonType === LessonType.QUIZ && (
              <QuizLesson
                lessonId={lessonId}
                quizData={lesson.quiz as QuizDataDetails}
              />
            )}
          </CardContent>

          {/* Lesson Completion Action Footer */}
          <CardFooter className="flex items-center justify-between border-t px-6 py-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              {isCompleted
                ? "You have completed this lesson."
                : "Mark this lesson as complete to unlock and automatically move to the next lesson."}
            </p>
            <Button
              onClick={handleToggleComplete}
              disabled={isUpdatingProgress}
              variant={isCompleted ? "outline" : "default"}
              className={
                isCompleted
                  ? "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }
            >
              {isUpdatingProgress ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 mr-2" />
              )}
              {isCompleted ? "Completed" : "Complete & Next Lesson ➔"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Enrollment Modal */}
      <EnrollmentModal
        courseId={courseId}
        courseTitle={courseTitle}
        price={coursePrice}
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </div>
  );
}
