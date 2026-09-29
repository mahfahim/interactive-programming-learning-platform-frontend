import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IDiscussionCommentCreatePayload,
  IDiscussionCommentUpdatePayload,
  IDiscussionReactionPayload,
  IDiscussionThreadCreatePayload,
  IDiscussionThreadUpdatePayload,
  IThreadQueryParams,
} from "@/types";

export function createThread(payload: IDiscussionThreadCreatePayload) {
  return apiClient<ApiResponse>("/api/v1/discussions/threads", {
    method: "POST",
    body: payload,
  });
}

export function getThreadsByLesson(
  lessonId: string,
  params?: IThreadQueryParams,
) {
  return apiClient<ApiResponse>(
    `/api/v1/discussions/threads/lesson/${lessonId}`,
    {
      params,
    },
  );
}

export function toggleThreadReaction(
  id: string,
  payload: IDiscussionReactionPayload,
) {
  return apiClient<ApiResponse>(`/api/v1/discussions/threads/${id}/react`, {
    method: "POST",
    body: payload,
  });
}

export function createComment(
  threadId: string,
  payload: IDiscussionCommentCreatePayload,
) {
  return apiClient<ApiResponse>(
    `/api/v1/discussions/threads/${threadId}/comments`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getThreadComments(threadId: string) {
  return apiClient<ApiResponse>(
    `/api/v1/discussions/threads/${threadId}/comments`,
  );
}

export function updateComment(
  id: string,
  payload: IDiscussionCommentUpdatePayload,
) {
  return apiClient<ApiResponse>(`/api/v1/discussions/comments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteComment(id: string) {
  return apiClient<ApiResponse>(`/api/v1/discussions/comments/${id}`, {
    method: "DELETE",
  });
}

export function toggleCommentReaction(
  id: string,
  payload: IDiscussionReactionPayload,
) {
  return apiClient<ApiResponse>(`/api/v1/discussions/comments/${id}/react`, {
    method: "POST",
    body: payload,
  });
}

export function getThreadById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/discussions/threads/${id}`);
}

export function updateThread(
  id: string,
  payload: IDiscussionThreadUpdatePayload,
) {
  return apiClient<ApiResponse>(`/api/v1/discussions/threads/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteThread(id: string) {
  return apiClient<ApiResponse>(`/api/v1/discussions/threads/${id}`, {
    method: "DELETE",
  });
}
