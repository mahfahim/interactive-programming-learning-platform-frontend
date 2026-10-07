"use client";

import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Award,
  CircleDollarSign,
  TrendingUp,
  Receipt,
  RotateCcw,
  RefreshCw,
  AlertCircle,
  CreditCard,
  UserCheck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { useAdminOverviewStats } from "@/hooks/analytics.hook";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Static keys for skeleton loaders to avoid using index as key
const SKELETON_CARD_KEYS = [
  "sk-net-earnings",
  "sk-total-users",
  "sk-total-enrollments",
  "sk-certificates-issued",
];

// ==========================================
// Helper Utilities
// ==========================================

const formatCurrency = (amount: number, currency = "BDT") => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};

// ==========================================
// Main Analytics Dashboard Component
// ==========================================

export default function AdminOverviewDashboard() {
  const { data: response, isLoading, isError, error, refetch } = useAdminOverviewStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4 p-6 text-center border rounded-xl bg-destructive/5">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold text-destructive">Failed to Load Analytics</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message || "An unexpected error occurred while fetching system metrics."}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const stats = response.data;
  const currency = stats.finance.currency || "BDT";

  // Data processing for charts
  const financeData = [
    { id: "fin-revenue", name: "Total Revenue", amount: stats.finance.totalRevenue, fill: "hsl(var(--primary))" },
    { id: "fin-net", name: "Net Earnings", amount: stats.finance.netEarnings, fill: "#10b981" },
    { id: "fin-refunded", name: "Total Refunded", amount: stats.finance.totalRefunded, fill: "#ef4444" },
  ];

  const enrollmentData = [
    { id: "enr-paid", name: "Paid Enrollments", value: stats.enrollments.paid, color: "#3b82f6" },
    { id: "enr-free", name: "Free Enrollments", value: stats.enrollments.free, color: "#10b981" },
  ];

  const userRoleData = [
    { id: "role-students", name: "Students", count: stats.users.students, color: "#6366f1" },
    { id: "role-instructors", name: "Instructors", count: stats.users.instructors, color: "#8b5cf6" },
  ];

  const activeUserRatio = stats.users.total > 0
    ? Math.round((stats.users.active / stats.users.total) * 100)
    : 0;

  const paidEnrollmentRatio = stats.enrollments.total > 0
    ? Math.round((stats.enrollments.paid / stats.enrollments.total) * 100)
    : 0;

  return (
    <div className="space-y-8 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time performance indicators, financial insights, and user engagement metrics.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" /> Refresh Stats
        </Button>
      </div>

      {/* Top Key Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Net Revenue */}
        <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Earnings
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg dark:bg-emerald-500/20">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(stats.finance.netEarnings, currency)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Gross: {formatCurrency(stats.finance.totalRevenue, currency)}
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg dark:bg-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.users.total)}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{stats.users.active} Active</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {activeUserRatio}% Active
              </Badge>
            </div>
            <Progress value={activeUserRatio} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Enrollments
            </CardTitle>
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg dark:bg-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.enrollments.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {formatNumber(stats.enrollments.paid)}
              </span>{" "}
              Paid ({paidEnrollmentRatio}%)
            </p>
          </CardContent>
        </Card>

        {/* Certificates Issued */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Certificates Issued
            </CardTitle>
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg dark:bg-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.achievements.certificatesIssued)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Across {stats.courses.total} Courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Financial Overview Bar Chart */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>
              Comparison of total revenue, refunds, and net earnings ({currency})
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs space-y-1">
                            <p className="font-semibold text-foreground">{data.name}</p>
                            <p className="text-muted-foreground font-medium">
                              {formatCurrency(data.amount, currency)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {financeData.map((entry) => (
                      <Cell key={entry.id} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enrollment Distribution Donut Chart */}
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Enrollment Distribution</CardTitle>
            <CardDescription>Breakdown between Paid and Free Course Registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full flex items-center justify-center">
              {stats.enrollments.total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrollmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {enrollmentData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const percentage = ((data.value / stats.enrollments.total) * 100).toFixed(1);
                          return (
                            <div className="rounded-lg border bg-background p-2.5 shadow-md text-xs space-y-1">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-muted-foreground">
                                {formatNumber(data.value)} ({percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No enrollment data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Roles Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">User Role Distribution</CardTitle>
            <CardDescription>Active platform user base categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userRoleData.map((role) => {
              const rolePercentage = stats.users.total > 0
                ? Math.round((role.count / stats.users.total) * 100)
                : 0;
              return (
                <div key={role.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                      {role.name}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {formatNumber(role.count)} ({rolePercentage}%)
                    </span>
                  </div>
                  <Progress value={rolePercentage} className="h-2" />
                </div>
              );
            })}
            <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Total Active Users
              </span>
              <span className="font-bold text-foreground">{formatNumber(stats.users.active)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Refund Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Financial Adjustments</CardTitle>
            <CardDescription>Refund vs total revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gross Revenue</p>
                  <p className="text-sm font-semibold">{formatCurrency(stats.finance.totalRevenue, currency)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-500/5 dark:bg-red-500/10 border-red-200 dark:border-red-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-red-500/10 text-red-600">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Refunded</p>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(stats.finance.totalRefunded, currency)}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Refund Rate:{" "}
              <span className="font-medium text-foreground">
                {stats.finance.totalRevenue > 0
                  ? ((stats.finance.totalRefunded / stats.finance.totalRevenue) * 100).toFixed(1)
                  : "0.0"}
                %
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Course & Achievement Highlights */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Platform Highlights</CardTitle>
            <CardDescription>Courses and achievements metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg bg-muted/30 text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xl font-bold">{formatNumber(stats.courses.total)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Active Courses</p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30 text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-xl font-bold">{formatNumber(stats.achievements.certificatesIssued)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Certificates Issued</p>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-blue-500/5 dark:bg-blue-500/10 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Enrollment Ratio
              </p>
              <p>
                Average of{" "}
                <span className="font-semibold text-foreground">
                  {stats.courses.total > 0
                    ? (stats.enrollments.total / stats.courses.total).toFixed(1)
                    : 0}
                </span>{" "}
                enrollments per published course.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ==========================================
// Loading Skeleton Component
// ==========================================

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-2 md:p-6">
      <div className="flex justify-between items-center border-b pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SKELETON_CARD_KEYS.map((key) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-70 w-full" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <Skeleton className="h-60 w-60 rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}