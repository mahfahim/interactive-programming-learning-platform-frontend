import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateModuleInput,
  IUpdateModuleInput,
} from "@/types";

export function createModule(payload: ICreateModuleInput) {
  return apiClient<ApiResponse>("/api/v1/modules", {
    method: "POST",
    body: payload,
  });
}

export function getModulesBySuperModule(superModuleId: string) {
  return apiClient<ApiResponse>(
    `/api/v1/modules/super-module/${superModuleId}`,
  );
}

export function getModuleById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/modules/${id}`);
}

export function updateModule(id: string, payload: IUpdateModuleInput) {
  return apiClient<ApiResponse>(`/api/v1/modules/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteModule(id: string) {
  return apiClient<ApiResponse>(`/api/v1/modules/${id}`, {
    method: "DELETE",
  });
}
