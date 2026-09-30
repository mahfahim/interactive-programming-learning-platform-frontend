import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignmentByLessonId,
  getassignmentsubmissions,
  getMySubmission,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
} from "@/api/assignment.api";
import type {
  ApiResponse,
  IAssignmentCreatePayload,
  IAssignmentGradePayload,
  IAssignmentUpdatePayload,
} from "@/types";

// Query Key Factory

export const assignmentKeys = {
  all: ["assignments"] as const,
  details: () => [...assignmentKeys.all, "detail"] as const,
  detail: (id: string) => [...assignmentKeys.details(), id] as const,
  byLesson: (lessonId: string) =>
    [...assignmentKeys.all, "lesson", lessonId] as const,
  submissions: () => [...assignmentKeys.all, "submissions"] as const,
  mySubmission: (assignmentId: string) =>
    [...assignmentKeys.submissions(), "my", assignmentId] as const,
  assignmentSubmissions: (id: string) =>
    [...assignmentKeys.submissions(), "assignment", id] as const,
};

// Custom Hooks - Queries

//   Fetch an assignment by lesson ID.

type UseAssignmentByLessonIdOptions = Omit<
  UseQueryOptions<ApiResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useAssignmentByLessonId(
  lessonId: string,
  options?: UseAssignmentByLessonIdOptions,
) {
  return useQuery({
    queryKey: assignmentKeys.byLesson(lessonId),
    queryFn: () => getAssignmentByLessonId(lessonId),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch an assignment by its ID.

type UseAssignmentByIdOptions = Omit<
  UseQueryOptions<ApiResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useAssignmentById(
  id: string,
  options?: UseAssignmentByIdOptions,
) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => getAssignmentById(id),
    enabled: !!id,
    ...options,
  });
}

//   Fetch current user's submission for a given assignment.

type UseMySubmissionOptions = Omit<
  UseQueryOptions<ApiResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useMySubmission(
  assignmentId: string,
  options?: UseMySubmissionOptions,
) {
  return useQuery({
    queryKey: assignmentKeys.mySubmission(assignmentId),
    queryFn: () => getMySubmission(assignmentId),
    enabled: !!assignmentId,
    ...options,
  });
}

//  Fetch all submissions for a specific assignment (Instructor/Admin view).

type UseAssignmentSubmissionsOptions = Omit<
  UseQueryOptions<ApiResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useAssignmentSubmissions(
  id: string,
  options?: UseAssignmentSubmissionsOptions,
) {
  return useQuery({
    queryKey: assignmentKeys.assignmentSubmissions(id),
    queryFn: () => getassignmentsubmissions(id),
    enabled: !!id,
    ...options,
  });
}

// Custom Hooks - Mutations

//  Create a new assignment.

type UseCreateAssignmentOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IAssignmentCreatePayload
>;

export function useCreateAssignment(options?: UseCreateAssignmentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssignment,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

//  Update an existing assignment.

type UpdateAssignmentVariables = {
  id: string;
  payload: IAssignmentUpdatePayload;
};

type UseUpdateAssignmentOptions = UseMutationOptions<
  ApiResponse,
  Error,
  UpdateAssignmentVariables
>;

export function useUpdateAssignment(options?: UseUpdateAssignmentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateAssignmentVariables) =>
      updateAssignment(id, payload),
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      options?.onSuccess?.(data, variables, ...args);
    },
    ...options,
  });
}

//  Delete an assignment.

type UseDeleteAssignmentOptions = UseMutationOptions<
  ApiResponse,
  Error,
  string
>;

export function useDeleteAssignment(options?: UseDeleteAssignmentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

//   Submit an assignment solution with file attachments.

type SubmitPayload = {
  assignmentId: string;
  files: File[];
};

type UseSubmitAssignmentOptions = UseMutationOptions<
  ApiResponse,
  Error,
  SubmitPayload
>;

export function useSubmitAssignment(options?: UseSubmitAssignmentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitAssignment,
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.mySubmission(variables.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.assignmentSubmissions(variables.assignmentId),
      });
      options?.onSuccess?.(data, variables, ...args);
    },
    ...options,
  });
}

//  Grade a student's submission.

type GradeSubmissionVariables = {
  submissionId: string;
  payload: IAssignmentGradePayload;
};

type UseGradeSubmissionOptions = UseMutationOptions<
  ApiResponse,
  Error,
  GradeSubmissionVariables
>;

export function useGradeSubmission(options?: UseGradeSubmissionOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, payload }: GradeSubmissionVariables) =>
      gradeSubmission(submissionId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: assignmentKeys.submissions(),
      });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
