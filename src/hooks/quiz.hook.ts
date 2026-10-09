import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteQuiz,
  getAttemptById,
  getMyAttempts,
  getQuizAttempts,
  getQuizById,
  getQuizByLessonId,
  submitQuiz,
} from "@/api/quiz.api";
import type { ApiResponse, ISubmitQuizPayload } from "@/types";

// Query Keys Factory
export const quizKeys = {
  all: ["quizzes"] as const,
  quizzes: () => [...quizKeys.all, "quiz"] as const,
  byLessonId: (lessonId: string) =>
    [...quizKeys.quizzes(), "lesson", lessonId] as const,
  detail: (id: string) => [...quizKeys.quizzes(), "detail", id] as const,
  attempts: () => [...quizKeys.all, "attempts"] as const,
  attemptDetail: (id: string) =>
    [...quizKeys.attempts(), "detail", id] as const,
  myAttempts: (quizLessonId: string) =>
    [...quizKeys.attempts(), "my", quizLessonId] as const,
  quizAttempts: (id: string) => [...quizKeys.attempts(), "quiz", id] as const,
};

type UseGetQuizByLessonIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetAttemptByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetMyAttemptsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetQuizAttemptsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetQuizByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseSubmitQuizOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ISubmitQuizPayload>,
  "mutationFn"
>;

type UseDeleteQuizOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch quiz details associated with a specific lesson ID
export function useGetQuizByLessonId(
  lessonId: string,
  options?: UseGetQuizByLessonIdOptions,
) {
  return useQuery({
    queryKey: quizKeys.byLessonId(lessonId),
    queryFn: () => getQuizByLessonId(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch details for a specific quiz attempt by ID
export function useGetAttemptById(
  id: string,
  options?: UseGetAttemptByIdOptions,
) {
  return useQuery({
    queryKey: quizKeys.attemptDetail(id),
    queryFn: () => getAttemptById(id),
    enabled: !!id,
    ...options,
  });
}

// Fetch current user's attempts for a specific quiz lesson
export function useGetMyAttempts(
  quizLessonId: string,
  options?: UseGetMyAttemptsOptions,
) {
  return useQuery({
    queryKey: quizKeys.myAttempts(quizLessonId),
    queryFn: () => getMyAttempts(quizLessonId),
    enabled: !!quizLessonId,
    ...options,
  });
}

// Fetch all attempt records for a quiz by quiz ID
export function useGetQuizAttempts(
  id: string,
  options?: UseGetQuizAttemptsOptions,
) {
  return useQuery({
    queryKey: quizKeys.quizAttempts(id),
    queryFn: () => getQuizAttempts(id),
    enabled: !!id,
    ...options,
  });
}

// Fetch details for a quiz by ID
export function useGetQuizById(id: string, options?: UseGetQuizByIdOptions) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: () => getQuizById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Submit quiz answers and process result
export function useSubmitQuiz(options?: UseSubmitQuizOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitQuiz,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a quiz by ID
export function useDeleteQuiz(options?: UseDeleteQuizOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.quizzes() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
