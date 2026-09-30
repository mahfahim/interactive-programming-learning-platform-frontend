import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  createThread,
  deleteComment,
  deleteThread,
  getThreadById,
  getThreadComments,
  getThreadsByLesson,
  toggleCommentReaction,
  toggleThreadReaction,
  updateComment,
  updateThread,
} from "@/api/discussion.api";
import type {
  ApiResponse,
  IDiscussionCommentCreatePayload,
  IDiscussionCommentUpdatePayload,
  IDiscussionReactionPayload,
  IDiscussionThreadCreatePayload,
  IDiscussionThreadUpdatePayload,
  IThreadQueryParams,
} from "@/types";

// Query Keys Factory
export const discussionKeys = {
  all: ["discussions"] as const,
  threads: () => [...discussionKeys.all, "threads"] as const,
  threadsByLesson: (lessonId: string, params?: IThreadQueryParams) =>
    [...discussionKeys.threads(), "lesson", lessonId, params] as const,
  threadDetails: () => [...discussionKeys.threads(), "detail"] as const,
  threadDetail: (id: string) =>
    [...discussionKeys.threadDetails(), id] as const,
  comments: () => [...discussionKeys.all, "comments"] as const,
  commentsByThread: (threadId: string) =>
    [...discussionKeys.comments(), "thread", threadId] as const,
};

// Types
type ToggleThreadReactionVariables = {
  id: string;
  payload: IDiscussionReactionPayload;
};

type CreateCommentVariables = {
  threadId: string;
  payload: IDiscussionCommentCreatePayload;
};

type UpdateCommentVariables = {
  id: string;
  payload: IDiscussionCommentUpdatePayload;
};

type ToggleCommentReactionVariables = {
  id: string;
  payload: IDiscussionReactionPayload;
};

type UpdateThreadVariables = {
  id: string;
  payload: IDiscussionThreadUpdatePayload;
};

type UseGetThreadsByLessonOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetThreadByIdOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetThreadCommentsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseCreateThreadOptions = Omit<
  UseMutationOptions<ApiResponse, Error, IDiscussionThreadCreatePayload>,
  "mutationFn"
>;

type UseToggleThreadReactionOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ToggleThreadReactionVariables>,
  "mutationFn"
>;

type UseUpdateThreadOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateThreadVariables>,
  "mutationFn"
>;

type UseDeleteThreadOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

type UseCreateCommentOptions = Omit<
  UseMutationOptions<ApiResponse, Error, CreateCommentVariables>,
  "mutationFn"
>;

type UseUpdateCommentOptions = Omit<
  UseMutationOptions<ApiResponse, Error, UpdateCommentVariables>,
  "mutationFn"
>;

type UseDeleteCommentOptions = Omit<
  UseMutationOptions<ApiResponse, Error, string>,
  "mutationFn"
>;

type UseToggleCommentReactionOptions = Omit<
  UseMutationOptions<ApiResponse, Error, ToggleCommentReactionVariables>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch discussion threads associated with a specific lesson
export function useGetThreadsByLesson(
  lessonId: string,
  params?: IThreadQueryParams,
  options?: UseGetThreadsByLessonOptions,
) {
  return useQuery({
    queryKey: discussionKeys.threadsByLesson(lessonId, params),
    queryFn: () => getThreadsByLesson(lessonId, params),
    enabled: !!lessonId,
    ...options,
  });
}

// Fetch a single discussion thread by its ID
export function useGetThreadById(
  id: string,
  options?: UseGetThreadByIdOptions,
) {
  return useQuery({
    queryKey: discussionKeys.threadDetail(id),
    queryFn: () => getThreadById(id),
    enabled: !!id,
    ...options,
  });
}

// Fetch comments for a specific discussion thread
export function useGetThreadComments(
  threadId: string,
  options?: UseGetThreadCommentsOptions,
) {
  return useQuery({
    queryKey: discussionKeys.commentsByThread(threadId),
    queryFn: () => getThreadComments(threadId),
    enabled: !!threadId,
    ...options,
  });
}

// Hooks - Mutations (Threads)

// Create a new discussion thread
export function useCreateThread(options?: UseCreateThreadOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createThread,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Toggle or update a reaction on a discussion thread
export function useToggleThreadReaction(
  options?: UseToggleThreadReactionOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ToggleThreadReactionVariables) =>
      toggleThreadReaction(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing discussion thread by ID
export function useUpdateThread(options?: UseUpdateThreadOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateThreadVariables) =>
      updateThread(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a discussion thread by ID
export function useDeleteThread(options?: UseDeleteThreadOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteThread(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Hooks - Mutations (Comments)

// Create a new comment on a discussion thread
export function useCreateComment(options?: UseCreateCommentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ threadId, payload }: CreateCommentVariables) =>
      createComment(threadId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.comments() });
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Update an existing comment by ID
export function useUpdateComment(options?: UseUpdateCommentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCommentVariables) =>
      updateComment(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.comments() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Delete a comment by ID
export function useDeleteComment(options?: UseDeleteCommentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.comments() });
      queryClient.invalidateQueries({ queryKey: discussionKeys.threads() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

// Toggle or update a reaction on a comment
export function useToggleCommentReaction(
  options?: UseToggleCommentReactionOptions,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ToggleCommentReactionVariables) =>
      toggleCommentReaction(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.comments() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
