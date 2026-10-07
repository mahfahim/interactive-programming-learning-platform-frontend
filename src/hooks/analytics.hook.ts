import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getAdminOverviewStats } from "@/api/analytics.api";
import type { AdminOverviewResponse } from "@/types/analytics.type";

export const analyticsKeys = {
  all: ["analytics"] as const,
  adminOverview: () => [...analyticsKeys.all, "admin-overview"] as const,
};

type UseAdminOverviewStatsOptions = Omit<
  UseQueryOptions<AdminOverviewResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useAdminOverviewStats(options?: UseAdminOverviewStatsOptions) {
  return useQuery({
    queryKey: analyticsKeys.adminOverview(),
    queryFn: getAdminOverviewStats,
    ...options,
  });
}
