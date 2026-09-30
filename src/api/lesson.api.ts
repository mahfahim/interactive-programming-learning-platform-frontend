import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateLessonInput,
  ISyncArticleLessonInput,
  IUpdateLessonInput,
  IUpdateLessonProgressInput,
  IUpsertVideoLessonInput,
} from "@/types";

export function getVideoLesson(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/video`);
}

export function upsertVideoLesson(
  lessonId: string,
  payload: IUpsertVideoLessonInput,
) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/video`, {
    method: "PATCH",
    body: payload,
  });
}

export function getArticleLesson(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/article`);
}

export function syncArticleLesson(
  lessonId: string,
  payload: ISyncArticleLessonInput,
) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/article`, {
    method: "PATCH",
    body: payload,
  });
}

export function getLessonProgress(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/progress`);
}

export function updateLessonProgress(
  lessonId: string,
  payload: IUpdateLessonProgressInput,
) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${lessonId}/progress`, {
    method: "PATCH",
    body: payload,
  });
}

export function createLesson(payload: ICreateLessonInput) {
  return apiClient<ApiResponse>("/api/v1/lessons", {
    method: "POST",
    body: payload,
  });
}

export function getLessonById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${id}`);
}

export function updateLesson(id: string, payload: IUpdateLessonInput) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteLesson(id: string) {
  return apiClient<ApiResponse>(`/api/v1/lessons/${id}`, {
    method: "DELETE",
  });
}
