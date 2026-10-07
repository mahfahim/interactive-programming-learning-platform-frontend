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
  getLessonById,
  getLessonsByModuleId,
  updateLesson,
  updateLessonProgress,
} from "@/api/lesson.api";
import type {
  ApiResponse,
  ICreateLessonInput,
  IUpdateLessonInput,
  IUpdateLessonProgressInput,
  TLessonResponse,
} from "@/types";
import { moduleKeys } from "./module.hook";
import { superModuleKeys } from "./superModule.hook";

export const lessonKeys = {
  all: ["lessons"] as const,
  byModule: (moduleId: string) =>
    [...lessonKeys.all, "module", moduleId] as const,
  details: () => [...lessonKeys.all, "detail"] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};

type UpdateLessonVariables = {
  id: string;
  payload: IUpdateLessonInput;
};

type UpdateProgressVariables = {
  id: string;
  payload: IUpdateLessonProgressInput;
};

type UseGetLessonByIdOptions = Omit<
  UseQueryOptions<ApiResponse<TLessonResponse>>,
  "queryKey" | "queryFn"
>;

type UseGetLessonsByModuleIdOptions = Omit<
  UseQueryOptions<ApiResponse<TLessonResponse[]>>,
  "queryKey" | "queryFn"
>;

type UseCreateLessonOptions = Omit<
  UseMutationOptions<ApiResponse<TLessonResponse>, Error, ICreateLessonInput>,
  "mutationFn"
>;

type UseUpdateLessonOptions = Omit<
  UseMutationOptions<
    ApiResponse<TLessonResponse>,
    Error,
    UpdateLessonVariables
  >,
  "mutationFn"
>;

type UseDeleteLessonOptions = Omit<
  UseMutationOptions<ApiResponse<TLessonResponse>, Error, string>,
  "mutationFn"
>;

type UseUpdateLessonProgressOptions = Omit<
  UseMutationOptions<
    ApiResponse<Record<string, unknown>>,
    Error,
    UpdateProgressVariables
  >,
  "mutationFn"
>;

// --- Queries ---

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

//  ADDED: Hook for fetching lessons by Module ID
export function useGetLessonsByModuleId(
  moduleId: string,
  options?: UseGetLessonsByModuleIdOptions,
) {
  return useQuery({
    queryKey: lessonKeys.byModule(moduleId),
    queryFn: () => getLessonsByModuleId(moduleId),
    enabled: !!moduleId,
    ...options,
  });
}

// --- Mutations ---

export function useCreateLesson(options?: UseCreateLessonOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: (payload: ICreateLessonInput) => createLesson(payload),
    onSuccess: async (...args) => {
      //  Sob query cache eksathe refetch & invalidate kora hocche
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
        queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
        queryClient.invalidateQueries({ queryKey: superModuleKeys.all }),
      ]);
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}

export function useUpdateLesson(options?: UseUpdateLessonOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: ({ id, payload }: UpdateLessonVariables) =>
      updateLesson(id, payload),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
        queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
        queryClient.invalidateQueries({ queryKey: superModuleKeys.all }),
      ]);
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}

export function useDeleteLesson(options?: UseDeleteLessonOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: (id: string) => deleteLesson(id),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
        queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
        queryClient.invalidateQueries({ queryKey: superModuleKeys.all }),
      ]);
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}

//  ADDED: Hook for updating lesson progress
export function useUpdateLessonProgress(
  options?: UseUpdateLessonProgressOptions,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: ({ id, payload }: UpdateProgressVariables) =>
      updateLessonProgress(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.all });
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}
