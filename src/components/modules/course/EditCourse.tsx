"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseForm } from "@/components/modules/course/shared/CourseForm";
import { Button } from "@/components/ui/button";
import { useGetCourseById, useUpdateCourse } from "@/hooks/course.hook";
import type { ICourse, ICreateCourseInput, IUpdateCourseInput } from "@/types";

interface EditCourseProps {
  courseId: string;
}

export function EditCourse({ courseId }: EditCourseProps) {
  const router = useRouter();
  const { data: courseData, isLoading, isError } = useGetCourseById(courseId);
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const course = courseData?.data as ICourse | undefined;

  const handleSubmit = (data: ICreateCourseInput | IUpdateCourseInput) => {
    updateCourse(
      { id: courseId, payload: data as IUpdateCourseInput },
      {
        onSuccess: (res) => {
          const isSuccess = res?.success ?? true;
          if (isSuccess) {
            toast.success(res?.message || "Course updated successfully!");
            router.push("/admin/courses");
          } else {
            toast.error(res?.message || "Failed to update course");
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || "Something went wrong while updating the course.",
          );
        },
      },
    );
  };

  const handleCancel = () => {
    router.push("/admin/courses");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="p-6 text-center">
        <p className="font-semibold text-destructive">
          Failed to load course details. Please try again.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/admin/courses")}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-sm text-muted-foreground">
              Update details for course:{" "}
              <span className="font-semibold">{course.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Course Form with Initial Data */}
      <CourseForm
        initialData={course}
        isSubmitting={isUpdating}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
