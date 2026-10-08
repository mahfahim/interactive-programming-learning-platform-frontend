"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CourseForm } from "@/components/modules/course/shared/CourseForm";
import { Button } from "@/components/ui/button";
import { useCreateCourse } from "@/hooks/course.hook";
import type { ICreateCourseInput, IUpdateCourseInput } from "@/types";

export function CreateCourse() {
  const router = useRouter();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const handleSubmit = (data: ICreateCourseInput | IUpdateCourseInput) => {
    createCourse(data as ICreateCourseInput, {
      onSuccess: (res) => {
        if (res?.success) {
          toast.success(res?.message || "Course created successfully!");
          router.push("/admin/courses");
        } else {
          toast.error(res?.message || "Failed to create course");
        }
      },
      onError: (error: Error) => {
        toast.error(
          error?.message || "Something went wrong while creating the course.",
        );
      },
    });
  };

  const handleCancel = () => {
    router.push("/admin/courses");
  };

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
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Course
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the information below to add a new course to the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Course Form */}
      <CourseForm
        isSubmitting={isPending}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
