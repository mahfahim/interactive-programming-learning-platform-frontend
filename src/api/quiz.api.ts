import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ISubmitQuizPayload,
} from "@/types";


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


export function deleteQuiz(id: string) {
  return apiClient<ApiResponse>(`/api/v1/quizzes/${id}`, {
    method: "DELETE",
  });
}
