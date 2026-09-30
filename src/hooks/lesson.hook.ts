import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createLesson,
  deleteLesson,
  getArticleLesson,
  getLessonById,
  getLessonProgress,
  getVideoLesson,
  syncArticleLesson,
  updateLesson,
  updateLessonProgress,
  upsertVideoLesson,
} from "@/api/lesson.api";
import type {
  ApiResponse,
  ICreateLessonInput,
  ISyncArticleLessonInput,
  IUpdateLessonInput,
  IUpdateLessonProgressInput,
  IUpsertVideoLessonInput,
} from "@/types";

// Query Keys Factory
export const lessonKeys = {
  all: ["lessons"] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
  video: (lessonId: string) => [...lessonKeys.all, lessonId, "video"] as const,
  article: (lessonId: string) =>
    [...lessonKeys.all, lessonId, "article"] as const,
  progress: (lessonId: string) =>
    [...lessonKeys.all, lessonId, "progress"] as const,
};

// Types
type UpsertVideoLessonVariables = {
  lessonId: string;
  payload: IUpsertVideoLessonInput;
};

type SyncArticleLessonVariables = {
  lessonId: string;
  payload: ISyncArticleLessonInput;
};

type UpdateLessonProgressVariables = {
  lessonId: string;
  payload: IUpdateLessonProgressInput;
};

type UpdateLessonVariables = {
  id: string;
  payload: IUpdateLessonInput;
};

type UseGetVideoLessonOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetArticleLessonOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetLessonProgressOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetLessonByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseUpsertVideoLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpsertVideoLessonVariables>,
  "mutationFn"
>;

type UseSyncArticleLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, SyncArticleLessonVariables>,
  "mutationFn"
>;

type UseUpdateLessonProgressOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateLessonProgressVariables>,
  "mutationFn"
>;

type UseCreateLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICreateLessonInput>,
  "mutationFn"
>;

type UseUpdateLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateLessonVariables>,
  "mutationFn"
>;

type UseDeleteLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch video lesson details by lesson ID
export function useGetVideoLesson(
  lessonId: string,
  options?: UseGetVideoLessonOptions,
) {
  return useQuery({
    queryKey: lessonKeys.video(lessonId),
    queryFn: () => getVideoLesson(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch article lesson details by lesson ID
export function useGetArticleLesson(
  lessonId: string,
  options?: UseGetArticleLessonOptions,
) {
  return useQuery({
    queryKey: lessonKeys.article(lessonId),
    queryFn: () => getArticleLesson(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch lesson progress for current user by lesson ID
export function useGetLessonProgress(
  lessonId: string,
  options?: UseGetLessonProgressOptions,
) {
  return useQuery({
    queryKey: lessonKeys.progress(lessonId),
    queryFn: () => getLessonProgress(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch lesson details by ID
export function useGetLessonById(
  id: string,
  options?: UseGetLessonByIdOptions,
) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: () => getLessonById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Upsert video lesson payload
export function useUpsertVideoLesson(options?: UseUpsertVideoLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, payload }: UpsertVideoLessonVariables) =>
      upsertVideoLesson(lessonId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync article lesson payload
export function useSyncArticleLesson(options?: UseSyncArticleLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, payload }: SyncArticleLessonVariables) =>
      syncArticleLesson(lessonId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update lesson progress for current user
export function useUpdateLessonProgress(
  options?: UseUpdateLessonProgressOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, payload }: UpdateLessonProgressVariables) =>
      updateLessonProgress(lessonId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Create a new lesson
export function useCreateLesson(options?: UseCreateLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing lesson
export function useUpdateLesson(options?: UseUpdateLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateLessonVariables) =>
      updateLesson(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a lesson by ID
export function useDeleteLesson(options?: UseDeleteLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLesson(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
