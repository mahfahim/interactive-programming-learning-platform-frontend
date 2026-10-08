"use client";

import { Eye, Edit, Trash2, Plus, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { CourseCard } from "@/components/modules/course/shared/CourseCard";
import { CourseEmptyState } from "@/components/modules/course/shared/CourseEmptyState";
import { CourseFilters } from "@/components/modules/course/shared/CourseFilters";
import { CourseForm } from "@/components/modules/course/shared/CourseForm";
import { CoursePagination } from "@/components/modules/course/shared/CoursePagination";
import { CourseSkeleton } from "@/components/modules/course/shared/CourseSkeleton";
import { DeleteCourseDialog } from "@/components/modules/course/shared/DeleteCourseDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateCourse,
  useDeleteCourse,
  useGetCourses,
  useGetMyCourses,
} from "@/hooks/course.hook";
import type { ICourse, ICreateCourseInput } from "@/types";
import { Role, type CourseLevel } from "@/types/enum.type";

interface AdminCourseManagementProps {
  role?: Role.ADMIN | Role.INSTRUCTOR;
  urlPrefix?: string;
}

export function AdminCourseManagement({
  role = Role.ADMIN,
  urlPrefix,
}: AdminCourseManagementProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  const isInstructor = role === Role.INSTRUCTOR;
  const isAdmin = role === Role.ADMIN;

  const basePrefix =
    urlPrefix || (isInstructor ? "/instructor/courses" : "/admin/courses");

  const queryParams = {
    search: search || undefined,
    level: level === "ALL" ? undefined : level,
    sortBy,
    sortOrder,
    page,
    limit: 8,
  };

  
  const generalQuery = useGetCourses(queryParams, {
    enabled: isAdmin,
  });

  const instructorQuery = useGetMyCourses({
    enabled: isInstructor,
  });

  const { data: response, isLoading } = isInstructor
    ? instructorQuery
    : generalQuery;

  
  const createCourseMutation = useCreateCourse({
    onSuccess: (res) => {
      const isSuccess = res?.success ?? true;
      if (isSuccess) {
        toast.success(res?.message || "Course created successfully!");
        setIsCreateOpen(false);
      } else {
        toast.error(res?.message || "Failed to create course");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Something went wrong while creating course",
      );
    },
  });

  const deleteCourseMutation = useDeleteCourse({
    onSuccess: (res) => {
      const isSuccess = res?.success ?? true;
      if (isSuccess) {
        toast.success(res?.message || "Course deleted successfully!");
        setCourseToDelete(null);
      } else {
        toast.error(res?.message || "Failed to delete course");
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Something went wrong while deleting course",
      );
    },
  });

  const courses = (response?.data as unknown as ICourse[]) || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isInstructor ? "My Courses" : "Course Management"}
          </h1>
          <p className="text-muted-foreground">
            {isInstructor
              ? "Manage your created courses, update content, and set up new ones."
              : "Admin view to oversee, edit, and manage all system courses."}
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 font-semibold"
        >
          <Plus className="h-4 w-4" /> Create Course
        </Button>
      </div>

      {/* Course Filters */}
      <CourseFilters
        search={search}
        level={level}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onLevelChange={(val) => {
          setLevel(val);
          setPage(1);
        }}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
      />

      {/* Course Cards Grid */}
      {isLoading ? (
        <CourseSkeleton count={8} />
      ) : courses.length === 0 ? (
        <CourseEmptyState
          title="No courses found"
          description="Click create course above to set up your first course."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                detailUrlPrefix={basePrefix}
                actions={
                  <>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="View Course"
                      >
                        <Link href={`${basePrefix}/${course.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="Edit Course"
                      >
                        <Link href={`${basePrefix}/${course.id}/edit`}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                        title="Course Builder"
                      >
                        <Link href={`${basePrefix}/${course.id}/builder`}>
                          <Layers className="h-4 w-4 text-emerald-600" />
                        </Link>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10"
                      onClick={() => setCourseToDelete(course)}
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                }
              />
            ))}
          </div>

          <CoursePagination
            page={page}
            totalPages={meta?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}

      {/* Create Course Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          {isCreateOpen && (
            <CourseForm
              isSubmitting={createCourseMutation.isPending}
              onSubmit={(data) =>
                createCourseMutation.mutate(data as ICreateCourseInput)
              }
              onCancel={() => setIsCreateOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        isOpen={!!courseToDelete}
        isDeleting={deleteCourseMutation.isPending}
        courseTitle={courseToDelete?.title}
        onClose={() => setCourseToDelete(null)}
        onConfirm={() =>
          courseToDelete && deleteCourseMutation.mutate(courseToDelete.id)
        }
      />
    </div>
  );
}