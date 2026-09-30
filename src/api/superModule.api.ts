import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateSuperModuleInput,
  IUpdateSuperModuleInput,
} from "@/types";

export function createSuperModule(payload: ICreateSuperModuleInput) {
  return apiClient<ApiResponse>("/api/v1/super-modules", {
    method: "POST",
    body: payload,
  });
}

export function getSuperModulesByCourse(courseId: string) {
  return apiClient<ApiResponse>(`/api/v1/super-modules/course/${courseId}`);
}

export function getSuperModuleById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/super-modules/${id}`);
}

export function updateSuperModule(
  id: string,
  payload: IUpdateSuperModuleInput,
) {
  return apiClient<ApiResponse>(`/api/v1/super-modules/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteSuperModule(id: string) {
  return apiClient<ApiResponse>(`/api/v1/super-modules/${id}`, {
    method: "DELETE",
  });
}
