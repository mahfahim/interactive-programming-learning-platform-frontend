import { BookOpen, DollarSign, ShieldAlert, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";

export default function AdminOverview() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of system statistics and performance metrics."
      />

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Users"
          value="1,248"
          description="+12% from last month"
          icon={Users}
        />
        <StatCard
          title="Active Courses"
          value="42"
          description="Across 8 categories"
          icon={BookOpen}
        />
        <StatCard
          title="Total Revenue"
          value="$18,450.00"
          description="+8% growth rate"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Approvals"
          value="5"
          description="Courses awaiting review"
          icon={ShieldAlert}
        />
      </div>
    </div>
  );
}