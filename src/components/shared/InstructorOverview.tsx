import { Award, BookOpen, DollarSign, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";

export function InstructorOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Dashboard"
        description="Manage your courses, track student performance, and view earnings."
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Courses"
          value="6"
          description="2 in review"
          icon={BookOpen}
        />
        <StatCard
          title="Total Students"
          value="450"
          description="Enrolled in your courses"
          icon={Users}
        />
        <StatCard
          title="Total Earnings"
          value="$3,200.00"
          description="This month"
          icon={DollarSign}
        />
        <StatCard
          title="Avg. Rating"
          value="4.8 / 5.0"
          description="From 120 reviews"
          icon={Award}
        />
      </div>
    </div>
  );
}
