"use client";

import { Badge } from "@/components/ui/badge";
import { Role } from "@/types";

interface UserRoleBadgeProps {
  role: Role;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case Role.ADMIN:
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-medium hover:bg-purple-100">
          Admin
        </Badge>
      );
    case Role.INSTRUCTOR:
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-medium hover:bg-blue-100">
          Instructor
        </Badge>
      );
    case Role.STUDENT:
    default:
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium hover:bg-emerald-100">
          Student
        </Badge>
      );
  }
}
