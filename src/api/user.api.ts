import apiClient from "@/lib/apiClient";
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

export function getMyProfile() {
  return apiClient<ApiResponse>("/api/v1/users/me");
}

export function updateMyProfile(payload: IUpdateUserProfileDto) {
  return apiClient<ApiResponse>("/api/v1/users/me", {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProfileImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  return apiClient<ApiResponse>("/api/v1/users/me/upload-image", {
    method: "PATCH",
    body: formData,
  });
}

export function syncMyEducations(payload: ISyncEducationsDto) {
  return apiClient<ApiResponse>("/api/v1/users/me/educations", {
    method: "PATCH",
    body: payload,
  });
}

export function syncMyExperiences(payload: ISyncExperiencesDto) {
  return apiClient<ApiResponse>("/api/v1/users/me/experiences", {
    method: "PATCH",
    body: payload,
  });
}

export function syncMySkills(payload: ISyncSkillsDto) {
  return apiClient<ApiResponse>("/api/v1/users/me/skills", {
    method: "PATCH",
    body: payload,
  });
}

export function syncMySocials(payload: ISyncSocialsDto) {
  return apiClient<ApiResponse>("/api/v1/users/me/socials", {
    method: "PATCH",
    body: payload,
  });
}

export function syncMyWebsites(payload: ISyncWebsitesDto) {
  return apiClient<ApiResponse>("/api/v1/users/me/websites", {
    method: "PATCH",
    body: payload,
  });
}

export function getAllUsers(params?: IUserFilterRequest) {
  return apiClient<ApiResponse>("/api/v1/users", {
    params,
  });
}

export function getUserById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/users/${id}`);
}

export function adminUpdateUser(id: string, payload: IAdminUpdateUserDto) {
  return apiClient<ApiResponse>(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function softDeleteUser(id: string) {
  return apiClient<ApiResponse>(`/api/v1/users/${id}`, {
    method: "DELETE",
  });
}
