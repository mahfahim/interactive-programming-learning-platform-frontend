import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCodingLesson,
  getCodingLessonByLessonId,
  getCodingLessonSubmissions,
  getMySubmissions,
  getSubmissionById,
  runCode,
  submitCode,
  updateCodingLesson,
  updateTestCases,
} from "@/api/judge.api";
import type {
  ApiResponse,
  ICodeRunPayload,
  ICodeSubmitPayload,
  ICodingLessonCreatePayload,
  ICodingLessonUpdatePayload,
  IUpdateTestCasesPayload,
} from "@/types";

// Query Keys Factory
export const judgeKeys = {
  all: ["judge"] as const,
  lessons: () => [...judgeKeys.all, "lessons"] as const,
  lessonByLessonId: (lessonId: string) =>
    [...judgeKeys.lessons(), "by-lesson", lessonId] as const,
  lessonSubmissions: (id: string) =>
    [...judgeKeys.lessons(), id, "submissions"] as const,
  submissions: () => [...judgeKeys.all, "submissions"] as const,
  mySubmissions: (codingLessonId: string) =>
    [...judgeKeys.submissions(), "my", codingLessonId] as const,
  submissionDetail: (id: string) =>
    [...judgeKeys.submissions(), "detail", id] as const,
};

// Types
type UpdateTestCasesVariables = {
  id: string;
  payload: IUpdateTestCasesPayload;
};

type UpdateCodingLessonVariables = {
  id: string;
  payload: ICodingLessonUpdatePayload;
};

type UseGetMySubmissionsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetCodingLessonSubmissionsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetCodingLessonByLessonIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetSubmissionByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseRunCodeOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICodeRunPayload>,
  "mutationFn"
>;

type UseSubmitCodeOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICodeSubmitPayload>,
  "mutationFn"
>;

type UseCreateCodingLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ICodingLessonCreatePayload>,
  "mutationFn"
>;

type UseUpdateTestCasesOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateTestCasesVariables>,
  "mutationFn"
>;

type UseUpdateCodingLessonOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateCodingLessonVariables>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch user submissions for a specific coding lesson
export function useGetMySubmissions(
  codingLessonId: string,
  options?: UseGetMySubmissionsOptions,
) {
  return useQuery({
    queryKey: judgeKeys.mySubmissions(codingLessonId),
    queryFn: () => getMySubmissions(codingLessonId),
    enabled: !!codingLessonId,
    ...options,
  });
}

// Fetch all submissions for a coding lesson
export function useGetCodingLessonSubmissions(
  id: string,
  options?: UseGetCodingLessonSubmissionsOptions,
) {
  return useQuery({
    queryKey: judgeKeys.lessonSubmissions(id),
    queryFn: () => getCodingLessonSubmissions(id),
    enabled: !!id,
    ...options,
  });
}

// Fetch coding lesson details by lesson ID
export function useGetCodingLessonByLessonId(
  lessonId: string,
  options?: UseGetCodingLessonByLessonIdOptions,
) {
  return useQuery({
    queryKey: judgeKeys.lessonByLessonId(lessonId),
    queryFn: () => getCodingLessonByLessonId(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch a specific submission by ID
export function useGetSubmissionById(
  id: string,
  options?: UseGetSubmissionByIdOptions,
) {
  return useQuery({
    queryKey: judgeKeys.submissionDetail(id),
    queryFn: () => getSubmissionById(id),
    enabled: !!id,
    ...options,
  });
}

// Hooks - Mutations

// Run code against test cases without altering persistent server state
export function useRunCode(options?: UseRunCodeOptions) {
  return useMutation({
    mutationFn: runCode,
    ...options,
  });
}

// Submit code solution and update submission state
export function useSubmitCode(options?: UseSubmitCodeOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitCode,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: judgeKeys.submissions() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Create a new coding lesson
export function useCreateCodingLesson(options?: UseCreateCodingLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCodingLesson,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: judgeKeys.lessons() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update test cases for a coding lesson
export function useUpdateTestCases(options?: UseUpdateTestCasesOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTestCasesVariables) =>
      updateTestCases(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: judgeKeys.lessons() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing coding lesson
export function useUpdateCodingLesson(options?: UseUpdateCodingLessonOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCodingLessonVariables) =>
      updateCodingLesson(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: judgeKeys.lessons() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
