import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSuperModule,
  deleteSuperModule,
  getSuperModuleById,
  getSuperModulesByCourse,
  updateSuperModule,
} from "@/api/superModule.api";
import type {
  ApiResponse,
  ICreateSuperModuleInput,
  IUpdateSuperModuleInput,
} from "@/types";

// Query Keys Factory
export const superModuleKeys = {
  all: ["super-modules"] as const,
  byCourse: (courseId: string) =>
    [...superModuleKeys.all, "course", courseId] as const,
  details: () => [...superModuleKeys.all, "detail"] as const,
  detail: (id: string) => [...superModuleKeys.details(), id] as const,
};

// Types
type UpdateSuperModuleVariables = {
  id: string;
  payload: IUpdateSuperModuleInput;
};

type UseGetSuperModulesByCourseOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetSuperModuleByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseCreateSuperModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICreateSuperModuleInput>,
  "mutationFn"
>;

type UseUpdateSuperModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateSuperModuleVariables>,
  "mutationFn"
>;

type UseDeleteSuperModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks - Queries

export function useGetSuperModulesByCourse(
  courseId: string,
  options?: UseGetSuperModulesByCourseOptions,
) {
  return useQuery({
    queryKey: superModuleKeys.byCourse(courseId),
    queryFn: () => getSuperModulesByCourse(courseId),
    enabled: !!courseId,
    ...options,
  });
}

export function useGetSuperModuleById(
  id: string,
  options?: UseGetSuperModuleByIdOptions,
) {
  return useQuery({
    queryKey: superModuleKeys.detail(id),
    queryFn: () => getSuperModuleById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Create a new super module
export function useCreateSuperModule(options?: UseCreateSuperModuleOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: createSuperModule,
    onSuccess: (...args) => {
      // Refresh all super module queries
      queryClient.invalidateQueries({ queryKey: superModuleKeys.all });
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}

// Update an existing super module by ID
export function useUpdateSuperModule(options?: UseUpdateSuperModuleOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: ({ id, payload }: UpdateSuperModuleVariables) =>
      updateSuperModule(id, payload),
    onSuccess: (...args) => {
      // Refresh all super module queries
      queryClient.invalidateQueries({ queryKey: superModuleKeys.all });
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}

// Delete a super module by ID
export function useDeleteSuperModule(options?: UseDeleteSuperModuleOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: (id: string) => deleteSuperModule(id),
    onSuccess: (...args) => {
      // Refresh all super module queries
      queryClient.invalidateQueries({ queryKey: superModuleKeys.all });
      onSuccess?.(...args);
    },
    ...restOptions,
  });
}
