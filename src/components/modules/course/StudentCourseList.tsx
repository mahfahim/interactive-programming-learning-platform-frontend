"use client";

import { useState } from "react";

import { CourseCard } from "@/components/modules/course/shared/CourseCard";
import { CourseEmptyState } from "@/components/modules/course/shared/CourseEmptyState";
import { CourseFilters } from "@/components/modules/course/shared/CourseFilters";
import { CoursePagination } from "@/components/modules/course/shared/CoursePagination";
import { CourseSkeleton } from "@/components/modules/course/shared/CourseSkeleton";
import { useGetCourses } from "@/hooks/course.hook";
import type { ICourse } from "@/types";
import type { CourseLevel } from "@/types/enum.type";

interface StudentCourseListProps {
  urlPrefix?: string;
}

export function StudentCourseList({ urlPrefix = "/courses" }: StudentCourseListProps) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<CourseLevel | "ALL">("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const queryParams = {
    search: search || undefined,
    level: level === "ALL" ? undefined : level,
    sortBy,
    sortOrder,
    page,
    limit: 8,
  };

  const { data: response, isLoading } = useGetCourses(queryParams);

  const courses = (response?.data as unknown as ICourse[]) || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
        <p className="text-muted-foreground">
          Explore our wide range of available programming courses.
        </p>
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
          description="Try modifying your search or filters to find courses."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                detailUrlPrefix={urlPrefix}
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
    </div>
  );
}