import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICodeRunPayload,
  ICodeSubmitPayload,
  ICodingLessonCreatePayload,
  ICodingLessonUpdatePayload,
  IUpdateTestCasesPayload,
} from "@/types";

export function runCode(payload: ICodeRunPayload) {
  return apiClient<ApiResponse>("/api/v1/judge/run", {
    method: "POST",
    body: payload,
  });
}

export function submitCode(payload: ICodeSubmitPayload) {
  return apiClient<ApiResponse>("/api/v1/judge/submit", {
    method: "POST",
    body: payload,
  });
}

export function getMySubmissions(codingLessonId: string) {
  return apiClient<ApiResponse>(
    `/api/v1/judge/my-submissions/${codingLessonId}`,
  );
}

export function createCodingLesson(payload: ICodingLessonCreatePayload) {
  return apiClient<ApiResponse>("/api/v1/judge/lessons", {
    method: "POST",
    body: payload,
  });
}

export function updateTestCases(
  id: string,
  payload: IUpdateTestCasesPayload,
) {
  return apiClient<ApiResponse>(`/api/v1/judge/lessons/${id}/test-cases`, {
    method: "PATCH",
    body: payload,
  });
}

export function getCodingLessonSubmissions(id: string) {
  return apiClient<ApiResponse>(`/api/v1/judge/lessons/${id}/submissions`);
}

export function updateCodingLesson(
  id: string,
  payload: ICodingLessonUpdatePayload,
) {
  return apiClient<ApiResponse>(`/api/v1/judge/lessons/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function getCodingLessonByLessonId(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/judge/lessons/${lessonId}`);
}

export function getSubmissionById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/judge/submissions/${id}`);
}