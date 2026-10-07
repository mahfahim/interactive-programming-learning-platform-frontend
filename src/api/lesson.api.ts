import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateLessonInput,
  IUpdateLessonInput,
  IUpdateLessonProgressInput,
  TLessonResponse,
} from "@/types";

export function createLesson(payload: ICreateLessonInput) {
  return apiClient<ApiResponse<TLessonResponse>>("/api/v1/lessons", {
    method: "POST",
    body: payload,
  });
}

export function getLessonById(id: string) {
  return apiClient<ApiResponse<TLessonResponse>>(`/api/v1/lessons/${id}`);
}

// 🟢 ADDED: Get lessons by module ID
export function getLessonsByModuleId(moduleId: string) {
  return apiClient<ApiResponse<TLessonResponse[]>>(
    `/api/v1/lessons/module/${moduleId}`,
  );
}

export function updateLesson(id: string, payload: IUpdateLessonInput) {
  return apiClient<ApiResponse<TLessonResponse>>(`/api/v1/lessons/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteLesson(id: string) {
  return apiClient<ApiResponse<TLessonResponse>>(`/api/v1/lessons/${id}`, {
    method: "DELETE",
  });
}


export function updateLessonProgress(
  id: string,
  payload: IUpdateLessonProgressInput,
) {
  return apiClient<ApiResponse<Record<string, unknown>>>(
    `/api/v1/lessons/${id}/progress`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}
