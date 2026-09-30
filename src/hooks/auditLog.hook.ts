import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/api/auditLog.api"; // Adjust path to match your API directory
import type { ApiResponse, IAuditLogFilterQuery } from "@/types";

// Query Key Factory

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  lists: () => [...auditLogKeys.all, "list"] as const,
  list: (params?: IAuditLogFilterQuery) =>
    [...auditLogKeys.lists(), params] as const,
};

// Custom Hooks

type UseAuditLogsOptions = Omit<
  UseQueryOptions<ApiResponse, Error>,
  "queryKey" | "queryFn"
>;

//   Fetch audit logs with optional filtering parameters.

export function useAuditLogs(
  params?: IAuditLogFilterQuery,
  options?: UseAuditLogsOptions,
) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => getAuditLogs(params),
    ...options,
  });
}
