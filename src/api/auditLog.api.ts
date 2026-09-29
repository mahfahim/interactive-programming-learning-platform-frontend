import apiClient from "@/lib/apiClient";
import type { ApiResponse, IAuditLogFilterQuery } from "@/types";

export function getAuditLogs(params?: IAuditLogFilterQuery) {
  return apiClient<ApiResponse>("/api/v1/audit-logs", {
    params,
  });
}