"use client";

import { useGetUserById } from "@/hooks/user.hook";
import type { IUserProfileResponse } from "@/types";
import { UserErrorState } from "./UserErrorState";
import { UserLoadingSkeleton } from "./UserLoadingSkeleton";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserProfileOverview } from "./UserProfileOverview";

interface PublicUserProfileProps {
  userId: string;
}

export function PublicUserProfile({ userId }: PublicUserProfileProps) {
  const { data, isLoading, isError, error, refetch } = useGetUserById(userId);

  if (isLoading) return <UserLoadingSkeleton />;
  if (isError || !data?.data) {
    return (
      <UserErrorState message={error?.message} onRetry={() => refetch()} />
    );
  }

  const profile = data.data as IUserProfileResponse;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <UserProfileHeader profile={profile} isOwnProfile={false} />
      <UserProfileOverview profile={profile} isOwnProfile={false} />
    </div>
  );
}
