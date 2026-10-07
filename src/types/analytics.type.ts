import type { ApiResponse } from "@/types/common.type";

export interface UserStats {
  total: number;
  students: number;
  instructors: number;
  active: number;
}

export interface CourseStats {
  total: number;
}

export interface EnrollmentStats {
  total: number;
  paid: number;
  free: number;
}

export interface FinanceStats {
  totalRevenue: number;
  totalRefunded: number;
  netEarnings: number;
  currency: string;
}

export interface AchievementStats {
  certificatesIssued: number;
}

export interface AdminOverviewStatsData {
  users: UserStats;
  courses: CourseStats;
  enrollments: EnrollmentStats;
  finance: FinanceStats;
  achievements: AchievementStats;
}

export type AdminOverviewResponse = ApiResponse<AdminOverviewStatsData>;
