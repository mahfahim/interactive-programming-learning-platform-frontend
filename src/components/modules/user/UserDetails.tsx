"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/hooks/user.hook";
import type { IUserProfileResponse } from "@/types";
import { UserErrorState } from "./UserErrorState";
import { UserLoadingSkeleton } from "./UserLoadingSkeleton";
import { UserProfileHeader } from "./UserProfileHeader";
import { UserProfileOverview } from "./UserProfileOverview";

interface UserDetailsProps {
  userId: string;
}

export function UserDetails({ userId }: UserDetailsProps) {
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
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4" /> Back to User Directory
          </Link>
        </Button>
      </div>

      <UserProfileHeader profile={profile} isOwnProfile={false} />
      <UserProfileOverview profile={profile} isOwnProfile={false} />
    </div>
  );
}
