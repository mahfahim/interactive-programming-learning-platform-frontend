import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModulesBySuperModule,
  updateModule,
} from "@/api/module.api";
import type {
  ApiResponse,
  ICreateModuleInput,
  IUpdateModuleInput,
} from "@/types";

// Query Keys Factory
export const moduleKeys = {
  all: ["modules"] as const,
  bySuperModule: (superModuleId: string) =>
    [...moduleKeys.all, "super-module", superModuleId] as const,
  details: () => [...moduleKeys.all, "detail"] as const,
  detail: (id: string) => [...moduleKeys.details(), id] as const,
};

// Types
type UpdateModuleVariables = {
  id: string;
  payload: IUpdateModuleInput;
};

type UseGetModulesBySuperModuleOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetModuleByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseCreateModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICreateModuleInput>,
  "mutationFn"
>;

type UseUpdateModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateModuleVariables>,
  "mutationFn"
>;

type UseDeleteModuleOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch modules belonging to a specific super module
export function useGetModulesBySuperModule(
  superModuleId: string,
  options?: UseGetModulesBySuperModuleOptions,
) {
  return useQuery({
    queryKey: moduleKeys.bySuperModule(superModuleId),
    queryFn: () => getModulesBySuperModule(superModuleId),
    enabled: !!superModuleId,
    ...options,
  });
}

// Fetch a single module by ID
export function useGetModuleById(
  id: string,
  options?: UseGetModuleByIdOptions,
) {
  return useQuery({
    queryKey: moduleKeys.detail(id),
    queryFn: () => getModuleById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Create a new module
export function useCreateModule(options?: UseCreateModuleOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModule,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing module by ID
export function useUpdateModule(options?: UseUpdateModuleOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateModuleVariables) =>
      updateModule(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a module by ID
export function useDeleteModule(options?: UseDeleteModuleOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteModule(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
