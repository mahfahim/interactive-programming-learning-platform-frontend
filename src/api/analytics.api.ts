import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export function getAdminOverviewStats() {
  return apiClient<ApiResponse>(
    "/api/v1/analytics/admin-overview",
  );
}
