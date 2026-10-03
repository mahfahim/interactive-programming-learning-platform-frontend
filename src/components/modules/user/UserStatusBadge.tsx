"use client";

import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800 font-medium hover:bg-green-100">
          Active
        </Badge>
      );
    case UserStatus.BLOCKED:
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-medium hover:bg-amber-100">
          Blocked
        </Badge>
      );
    case UserStatus.DELETED:
      return (
        <Badge variant="destructive" className="font-medium">
          Deleted
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
