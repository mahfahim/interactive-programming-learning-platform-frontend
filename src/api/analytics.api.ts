// // src/api/analytics.api.ts

import apiClient from "@/lib/apiClient";
import type { AdminOverviewResponse } from "@/types/analytics.type";

export function getAdminOverviewStats() {
  // Pass the specific response type so the data payload is strongly typed
  return apiClient<AdminOverviewResponse>("/api/v1/analytics/admin-overview");
}
