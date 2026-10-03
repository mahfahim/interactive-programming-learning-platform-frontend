"use client";

import { useGetMyProfile } from "@/hooks/user.hook";
import type { IUserProfileResponse } from "@/types";
import { UserErrorState } from "./UserErrorState";
import { UserLoadingSkeleton } from "./UserLoadingSkeleton";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserProfileOverview } from "./UserProfileOverview";

export function UserProfile() {
  const { data, isLoading, isError, error, refetch } = useGetMyProfile();

  if (isLoading) return <UserLoadingSkeleton />;
  if (isError || !data?.data) {
    return (
      <UserErrorState message={error?.message} onRetry={() => refetch()} />
    );
  }

  const profile = data.data as IUserProfileResponse;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <UserProfileHeader profile={profile} isOwnProfile={true} />
      <UserProfileOverview profile={profile} isOwnProfile={true} />
    </div>
  );
}
