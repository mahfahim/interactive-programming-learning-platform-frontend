"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type IUserFilterRequest, Role, UserStatus } from "@/types";

interface UserFiltersProps {
  filters: IUserFilterRequest;
  onChange: (filters: IUserFilterRequest) => void;
}

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name or email..."
          value={filters.search || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value || undefined,
              page: 1,
            })
          }
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <select
          aria-label="Filter by role"
          value={filters.role || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              role: (e.target.value as Role) || undefined,
              page: 1,
            })
          }
          className="p-2 text-sm border rounded-md bg-background w-full sm:w-36"
        >
          <option value="">All Roles</option>
          {Object.values(Role).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={filters.status || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              status: (e.target.value as UserStatus) || undefined,
              page: 1,
            })
          }
          className="p-2 text-sm border rounded-md bg-background w-full sm:w-36"
        >
          <option value="">All Statuses</option>
          {Object.values(UserStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort order"
          value={filters.sortOrder || "desc"}
          onChange={(e) =>
            onChange({
              ...filters,
              sortOrder: e.target.value as "asc" | "desc",
              page: 1,
            })
          }
          className="p-2 text-sm border rounded-md bg-background w-full sm:w-32"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
