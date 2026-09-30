import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyCourses,
  updateCourse,
} from "@/api/course.api";
import type {
  ApiResponse,
  ICourseQueryParams,
  ICreateCourseInput,
  IUpdateCourseInput,
} from "@/types";

// Query Keys Factory
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (params?: ICourseQueryParams) =>
    [...courseKeys.lists(), params] as const,
  myCourses: () => [...courseKeys.all, "my-courses"] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

// Types
type UpdateCourseVariables = {
  id: string;
  payload: IUpdateCourseInput;
};

type UseGetCoursesOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetMyCoursesOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetCourseByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseCreateCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICreateCourseInput>,
  "mutationFn"
>;

type UseUpdateCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateCourseVariables>,
  "mutationFn"
>;

type UseDeleteCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks

// Fetch a list of courses with optional filter parameters
export function useGetCourses(
  params?: ICourseQueryParams,
  options?: UseGetCoursesOptions,
) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourses(params),
    ...options,
  });
}

// Fetch current user's courses
export function useGetMyCourses(options?: UseGetMyCoursesOptions) {
  return useQuery({
    queryKey: courseKeys.myCourses(),
    queryFn: getMyCourses,
    ...options,
  });
}

// Fetch a single course by its ID
export function useGetCourseById(
  id: string,
  options?: UseGetCourseByIdOptions,
) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => getCourseById(id),
    enabled: !!id,
    ...options,
  });
}

// Create a new course
export function useCreateCourse(options?: UseCreateCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing course by ID
export function useUpdateCourse(options?: UseUpdateCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCourseVariables) =>
      updateCourse(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a course by ID
export function useDeleteCourse(options?: UseDeleteCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
