import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateQuizPayload,
  ISubmitQuizPayload,
  IUpdateQuizPayload,
} from "@/types";

export function createQuiz(payload: ICreateQuizPayload) {
  return apiClient<ApiResponse>("/api/v1/quizzes", {
    method: "POST",
    body: payload,
  });
}

export function getQuizByLessonId(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/lessons/${lessonId}`);
}

export function submitQuiz(payload: ISubmitQuizPayload) {
  return apiClient<ApiResponse>("/api/v1/quizzes/submit", {
    method: "POST",
    body: payload,
  });
}

export function getAttemptById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/attempts/${id}`);
}

export function getMyAttempts(quizLessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/my-attempts/${quizLessonId}`);
}

export function getQuizAttempts(id: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/${id}/attempts`);
}

export function getQuizById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/${id}`);
}

export function updateQuiz(id: string, payload: IUpdateQuizPayload) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteQuiz(id: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/${id}`, {
    method: "DELETE",
  });
}
