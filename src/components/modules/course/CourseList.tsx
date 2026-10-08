"use client";

import { useState } from "react";
import { useGetCourses, useGetMyCourses } from "@/hooks/course.hook";
import { Role } from "@/types/enum.type";
import type { ICourse } from "@/types";
import type { CourseLevel } from "@/types/enum.type";
import { CourseCard } from "./shared/CourseCard";
import { CourseEmptyState } from "./shared/CourseEmptyState";
import { CourseErrorState } from "./shared/CourseErrorState";
import { CourseFilters } from "./shared/CourseFilters";
import { CoursePagination } from "./shared/CoursePagination";
import { CourseSkeleton } from "./shared/CourseSkeleton";

interface CourseListProps {
  detailUrlPrefix?: string;
  role?: Role; 
}

export function CourseList({
  detailUrlPrefix = "/courses",
  role = Role.ADMIN,
}: CourseListProps) {
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

  const isInstructor = role === Role.INSTRUCTOR;

  
  const adminQuery = useGetCourses(queryParams, {
    enabled: !isInstructor, 
  });

  
  const instructorQuery = useGetMyCourses({
    enabled: isInstructor, 
  });

  
  const activeQuery = isInstructor ? instructorQuery : adminQuery;

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = activeQuery;

  
  const courses = (response?.data as unknown as ICourse[]) || [];
  const meta = response?.meta;

  return (
    <div className="space-y-6">
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

      {isLoading ? (
        <CourseSkeleton count={8} />
      ) : isError ? (
        <CourseErrorState
          message={(error as Error)?.message || "Failed to fetch courses"}
          onRetry={refetch}
        />
      ) : courses.length === 0 ? (
        <CourseEmptyState
          title="No courses found"
          description="Try modifying your search or filters to find what you are looking for."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                detailUrlPrefix={detailUrlPrefix}
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