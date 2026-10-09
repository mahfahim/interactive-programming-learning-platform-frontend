"use client";

import {
  AlertTriangle,
  BookOpen,
  Eye,
  Layers,
  LayoutGrid,
  List,
  ListOrdered,
  RefreshCw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSuperModulesByCourse } from "@/hooks/superModule.hook";
import type { ISuperModule } from "@/types";

interface StudentSuperModuleListProps {
  courseId: string;
  showStats?: boolean;
}

export function StudentSuperModuleList({
  courseId,
  showStats = true,
}: StudentSuperModuleListProps) {
  const { data, isLoading, isError, refetch } =
    useGetSuperModulesByCourse(courseId);

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const superModules: ISuperModule[] = useMemo(() => {
    if (!data?.data) return [];
    return Array.isArray(data.data) ? data.data : [data.data];
  }, [data]);

  const filteredSuperModules = useMemo(() => {
    return superModules
      .filter((sm) =>
        sm.title.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      )
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [superModules, searchTerm]);

  if (isLoading) {
    return <SuperModuleSkeleton count={3} />;
  }

  if (isError) {
    return <SuperModuleErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SuperModuleHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Stats */}
      {showStats && superModules.length > 0 && (
        <SuperModuleStats superModules={superModules} />
      )}

      {/* Content Rendering */}
      {filteredSuperModules.length === 0 ? (
        <SuperModuleEmptyState />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSuperModules.map((sm) => (
            <SuperModuleCard key={sm.id} superModule={sm} courseId={courseId} />
          ))}
        </div>
      ) : (
        <SuperModuleTableView
          superModules={filteredSuperModules}
          courseId={courseId}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   Sub-components (Student Read-Only Versions)
   ========================================================================== */

interface SuperModuleHeaderProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

function SuperModuleHeader({
  title = "Super Modules Curriculum",
  description = "Explore course content organized into high-level foundational modules.",
  searchTerm = "",
  onSearchChange,
  viewMode = "list",
  onViewModeChange,
}: SuperModuleHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange && (
          <div className="relative min-w-50 flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter super modules..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-8 text-xs"
            />
          </div>
        )}

        {onViewModeChange && (
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 px-2.5 text-xs"
            >
              <List className="mr-1 h-3.5 w-3.5" />
              List
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 px-2.5 text-xs"
            >
              <LayoutGrid className="mr-1 h-3.5 w-3.5" />
              Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SuperModuleCardProps {
  superModule: ISuperModule;
  courseId?: string;
}

function SuperModuleCard({ superModule, courseId }: SuperModuleCardProps) {
  const moduleCount = superModule.modules?.length || 0;
  const activeCourseId = courseId || superModule.courseId;

  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card transition-all hover:border-primary/40 hover:shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start space-x-3">
          <Badge
            variant="secondary"
            className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-md bg-muted font-mono text-xs font-semibold text-foreground"
          >
            #{superModule.displayOrder}
          </Badge>

          <div>
            <Link
              href={`/student/courses/${activeCourseId}/super-modules/${superModule.id}`}
            >
              <h3 className="cursor-pointer text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary hover:underline">
                {superModule.title}
              </h3>
            </Link>
            {superModule.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {superModule.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <Link
            href={`/student/courses/${activeCourseId}/super-modules/${superModule.id}`}
            className="flex cursor-pointer items-center gap-1.5 font-medium hover:text-primary"
          >
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>
              {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface SuperModuleTableViewProps {
  superModules: ISuperModule[];
  courseId: string;
}

function SuperModuleTableView({
  superModules,
  courseId,
}: SuperModuleTableViewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-20 text-center font-semibold">
              Order
            </TableHead>
            <TableHead className="font-semibold">
              Super Module Title & Description
            </TableHead>
            <TableHead className="w-36 text-center font-semibold">
              Modules
            </TableHead>
            <TableHead className="w-28 pr-6 text-right font-semibold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {superModules.map((sm) => {
            const moduleCount = sm.modules?.length || 0;

            return (
              <TableRow
                key={sm.id}
                className="transition-colors hover:bg-muted/30"
              >
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="bg-muted/60 font-mono text-xs font-semibold"
                  >
                    #{sm.displayOrder}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`/student/courses/${courseId}/super-modules/${sm.id}`}
                      className="text-sm font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                    >
                      {sm.title}
                    </Link>
                    {sm.description && (
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {sm.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className="gap-1 text-xs font-normal"
                  >
                    <BookOpen className="h-3 w-3 text-primary" />
                    {moduleCount} {moduleCount === 1 ? "Module" : "Modules"}
                  </Badge>
                </TableCell>

                <TableCell className="pr-4 text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    title="View Details"
                  >
                    <Link
                      href={`/student/courses/${courseId}/super-modules/${sm.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

interface SuperModuleStatsProps {
  superModules: ISuperModule[];
}

function SuperModuleStats({ superModules }: SuperModuleStatsProps) {
  const totalSuperModules = superModules.length;
  const totalModules = superModules.reduce(
    (acc, sm) => acc + (sm.modules?.length || 0),
    0,
  );
  const maxDisplayOrder = superModules.reduce(
    (max, sm) => (sm.displayOrder > max ? sm.displayOrder : max),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Super Modules
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {totalSuperModules}
            </h4>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 text-chart-2">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Nested Modules
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {totalModules}
            </h4>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card">
        <CardContent className="flex items-center space-x-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
            <ListOrdered className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Highest Display Order
            </p>
            <h4 className="text-xl font-bold text-foreground">
              {maxDisplayOrder}
            </h4>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SuperModuleEmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Layers className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        No Super Modules Found
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The curriculum structure for this course is currently being prepared.
        Check back soon!
      </p>
    </div>
  );
}

interface SuperModuleErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function SuperModuleErrorState({
  message = "Failed to load super modules. Please check your connection.",
  onRetry,
}: SuperModuleErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h4 className="mt-3 text-base font-semibold text-foreground">
        Error Loading Curriculum
      </h4>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-2 border-destructive/30 hover:bg-destructive/10"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}

interface SuperModuleSkeletonProps {
  count?: number;
}

function SuperModuleSkeleton({ count = 3 }: SuperModuleSkeletonProps) {
  const items = Array.from(
    { length: count },
    (_, i) => `super-module-skeleton-${i}`,
  );

  return (
    <div className="space-y-4">
      {items.map((id) => (
        <Card key={id} className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-7 w-10 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="ml-13 space-y-2 border-l-2 border-muted pl-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
