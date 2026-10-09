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
  UseMutationOptions<ApiResponse, Error, ICreateCourseInput, unknown>,
  "mutationFn"
>;

type UseUpdateCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateCourseVariables, unknown>,
  "mutationFn"
>;

type UseDeleteCourseOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string, unknown>,
  "mutationFn"
>;

// Fetch a list of courses
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
export function useGetMyCourses(
  params?: ICourseQueryParams,
  options?: UseGetMyCoursesOptions,
) {
  return useQuery({
    queryKey: [...courseKeys.myCourses(), params],
    queryFn: () => getMyCourses(params),
    ...options,
  });
}

// Fetch a single course by ID
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
    ...options,
    mutationFn: createCourse,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
}

// Update an existing course by ID
export function useUpdateCourse(options?: UseUpdateCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }: UpdateCourseVariables) =>
      updateCourse(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
}

// Delete a course by ID
export function useDeleteCourse(options?: UseDeleteCourseOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
}
