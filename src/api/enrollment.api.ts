import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export function enrollCourse(
  courseId: string,
  payload?: { paymentGateway?: "BKASH" | "SSLCOMMERZ" },
) {
  return apiClient<ApiResponse>(`/api/v1/enrollments/${courseId}/enroll`, {
    method: "POST",
    body: payload,
  });
}

export function getMyEnrolledCourses() {
  return apiClient<ApiResponse>("/api/v1/enrollments/my-courses");
}
