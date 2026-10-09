import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICourseQueryParams,
  ICreateCourseInput,
  IUpdateCourseInput,
} from "@/types";

export function createCourse(payload: ICreateCourseInput) {
  return apiClient<ApiResponse>("/api/v1/courses", {
    method: "POST",
    body: payload,
  });
}

export function getCourses(params?: ICourseQueryParams) {
  return apiClient<ApiResponse>("/api/v1/courses", {
    params,
  });
}

export function getMyCourses(params?: ICourseQueryParams) {
  return apiClient<ApiResponse>("/api/v1/courses/my-courses", {
    params,
  });
}

export function getCourseById(id: string) {
  return apiClient<ApiResponse>(`/api/v1/courses/${id}`);
}

export function updateCourse(id: string, payload: IUpdateCourseInput) {
  return apiClient<ApiResponse>(`/api/v1/courses/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCourse(id: string) {
  return apiClient<ApiResponse>(`/api/v1/courses/${id}`, {
    method: "DELETE",
  });
}
