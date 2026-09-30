import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enrollCourse, getMyEnrolledCourses } from "@/api/enrollment.api";
import type { ApiResponse } from "@/types";

// Query Keys Factory
export const enrollmentKeys = {
  all: ["enrollments"] as const,
  myCourses: () => [...enrollmentKeys.all, "my-courses"] as const,
};

// Types
type EnrollCourseVariables = {
  courseId: string;
  payload?: { paymentGateway?: "BKASH" | "SSLCOMMERZ" };
};

type UseGetMyEnrolledCoursesOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseEnrollCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, EnrollCourseVariables>,
  "mutationFn"
>;

// Hooks

// Fetch all enrolled courses for the current user
export function useGetMyEnrolledCourses(
  options?: UseGetMyEnrolledCoursesOptions,
) {
  return useQuery({
    queryKey: enrollmentKeys.myCourses(),
    queryFn: getMyEnrolledCourses,
    ...options,
  });
}

// Enroll current user in a course
export function useEnrollCourse(options?: UseEnrollCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, payload }: EnrollCourseVariables) =>
      enrollCourse(courseId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
