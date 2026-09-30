import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IAssignmentCreatePayload,
  IAssignmentGradePayload,
  IAssignmentUpdatePayload,
} from "@/types";

export function createAssignment(payload: IAssignmentCreatePayload) {
  return apiClient<ApiResponse>("/api/v1/assignments", {
    method: "POST",
    body: payload,
  });
}

export function getAssignmentByLessonId(lessonId: string) {
  return apiClient<ApiResponse>(`/api/v1/assignments/lessons/${lessonId}`);
}

export function getAssignmentById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/assignments/${id}`);
}

export function updateAssignment(
  id: string,
  payload: IAssignmentUpdatePayload,
) {
  return apiClient<ApiResponse>(`/api/v1/assignments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAssignment(id: string) {
  return apiClient<ApiResponse>(`/api/v1/assignments/${id}`, {
    method: "DELETE",
  });
}

export function submitAssignment(payload: {
  assignmentId: string;
  files: File[];
}) {
  const formData = new FormData();
  formData.append("assignmentId", payload.assignmentId);

  for (const file of payload.files) {
    formData.append("files", file);
  }

  return apiClient<ApiResponse>("/api/v1/assignments/submit", {
    method: "POST",
    body: formData,
  });
}

export function getMySubmission(assignmentId: string) {
  return apiClient<ApiResponse>(
    `/api/v1/assignments/my-submission/${assignmentId}`,
  );
}

export function getassignmentsubmissions(id: string) {
  return apiClient<ApiResponse>(`/api/v1/assignments/${id}/submissions`);
}

export function gradeSubmission(
  submissionId: string,
  payload: IAssignmentGradePayload,
) {
  return apiClient<ApiResponse>(
    `/api/v1/assignments/submissions/${submissionId}/grade`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}
