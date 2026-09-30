import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  adminUpdateUser,
  getAllUsers,
  getMyProfile,
  getUserById,
  softDeleteUser,
  syncMyEducations,
  syncMyExperiences,
  syncMySkills,
  syncMySocials,
  syncMyWebsites,
  updateMyProfile,
  uploadProfileImage,
} from "@/api/user.api";
import type {
  ApiResponse,
  IAdminUpdateUserDto,
  ISyncEducationsDto,
  ISyncExperiencesDto,
  ISyncSkillsDto,
  ISyncSocialsDto,
  ISyncWebsitesDto,
  IUpdateUserProfileDto,
  IUserFilterRequest,
} from "@/types";

// Query Keys Factory
export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: IUserFilterRequest) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Types
type AdminUpdateUserVariables = {
  id: string;
  payload: IAdminUpdateUserDto;
};

type UseGetMyProfileOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetAllUsersOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetUserByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseUpdateMyProfileOptions = Omit<
  UseMutationOptions<ApiResponse, Error, IUpdateUserProfileDto>,
  "mutationFn"
>;

type UseUploadProfileImageOptions = Omit<
  UseMutationOptions<ApiResponse, Error, File>,
  "mutationFn"
>;

type UseSyncMyEducationsOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISyncEducationsDto>,
  "mutationFn"
>;

type UseSyncMyExperiencesOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISyncExperiencesDto>,
  "mutationFn"
>;

type UseSyncMySkillsOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISyncSkillsDto>,
  "mutationFn"
>;

type UseSyncMySocialsOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISyncSocialsDto>,
  "mutationFn"
>;

type UseSyncMyWebsitesOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISyncWebsitesDto>,
  "mutationFn"
>;

type UseAdminUpdateUserOptions = Omit<
  UseMutationOptions<ApiResponse, Error, AdminUpdateUserVariables>,
  "mutationFn"
>;

type UseSoftDeleteUserOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch current logged-in user profile
export function useGetMyProfile(options?: UseGetMyProfileOptions) {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyProfile,
    ...options,
  });
}

// Fetch list of users with optional filtering parameters
export function useGetAllUsers(
  params?: IUserFilterRequest,
  options?: UseGetAllUsersOptions,
) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getAllUsers(params),
    ...options,
  });
}

// Fetch a single user by ID
export function useGetUserById(id: string, options?: UseGetUserByIdOptions) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Update current user profile details
export function useUpdateMyProfile(options?: UseUpdateMyProfileOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Upload profile image for current user
export function useUploadProfileImage(options?: UseUploadProfileImageOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync education records for current user
export function useSyncMyEducations(options?: UseSyncMyEducationsOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncMyEducations,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync work experience records for current user
export function useSyncMyExperiences(options?: UseSyncMyExperiencesOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncMyExperiences,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync skills for current user
export function useSyncMySkills(options?: UseSyncMySkillsOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncMySkills,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync social media links for current user
export function useSyncMySocials(options?: UseSyncMySocialsOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncMySocials,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Sync personal website links for current user
export function useSyncMyWebsites(options?: UseSyncMyWebsitesOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncMyWebsites,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Admin update user details by ID
export function useAdminUpdateUser(options?: UseAdminUpdateUserOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: AdminUpdateUserVariables) =>
      adminUpdateUser(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Soft delete a user account by ID
export function useSoftDeleteUser(options?: UseSoftDeleteUserOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => softDeleteUser(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
