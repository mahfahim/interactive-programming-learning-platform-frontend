"use client";

import {
  AlertCircle,
  BookOpen,
  Code,
  FileCheck,
  FileText,
  Hash,
  HelpCircle,
  Layers,
  Lock,
  PlayCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetModulesBySuperModule } from "@/hooks/module.hook";
import type { IModule, ISuperModule } from "@/types";
import { LessonType } from "@/types";

interface StudentModuleListProps {
  superModuleId: string;
  courseId?: string;
  showStats?: boolean;
}

export function StudentModuleList({
  superModuleId,
  courseId,
  showStats = true,
}: StudentModuleListProps) {
  // 1. Data Fetching via React Query Hook
  const {
    data: modulesResponse,
    isLoading,
    isError,
    refetch,
  } = useGetModulesBySuperModule(superModuleId);

  // 2. View Modal State (Read-only details)
  const [selectedModuleForView, setSelectedModuleForView] =
    useState<IModule | null>(null);

  // 3. Safe Data Extraction
  const modules: IModule[] = useMemo(() => {
    if (!modulesResponse?.data) return [];
    const rawData = modulesResponse.data as IModule[] | ISuperModule;
    return Array.isArray(rawData) ? rawData : rawData.modules || [];
  }, [modulesResponse]);

  // Loading State
  if (isLoading) {
    return <ModuleSkeleton />;
  }

  // Error State with Retry
  if (isError) {
    return (
      <ModuleErrorState
        message="Failed to load modules for this super module."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <ModuleHeader totalModules={modules.length} />

      {/* 2. Stats Section */}
      {showStats && modules.length > 0 && <ModuleStats modules={modules} />}

      {/* 3. Main Content Rendering */}
      {modules.length === 0 ? (
        <ModuleEmptyState />
      ) : (
        <ModuleAccordion
          modules={modules}
          courseId={courseId}
          superModuleId={superModuleId}
        />
      )}

      {/* Read-Only Details View Dialog */}
      {selectedModuleForView && (
        <ModuleDetails
          open={Boolean(selectedModuleForView)}
          onOpenChange={(open) => !open && setSelectedModuleForView(null)}
          module={selectedModuleForView}
        />
      )}
    </div>
  );
}

/* ==========================================================================
   Sub-components (Student Read-Only Versions)
   ========================================================================== */

interface ModuleHeaderProps {
  title?: string;
  totalModules?: number;
}

function ModuleHeader({
  title = "Modules",
  totalModules = 0,
}: ModuleHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-3">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {totalModules}
        </span>
      </div>
    </div>
  );
}

interface ModuleStatsProps {
  modules: IModule[];
}

function ModuleStats({ modules }: ModuleStatsProps) {
  const totalModules = modules.length;
  const totalLessons = modules.reduce((acc, mod) => {
    return acc + (Array.isArray(mod.lessons) ? mod.lessons.length : 0);
  }, 0);

  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      <Card className="border-border/60 bg-card/50">
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Modules
            </p>
            <p className="text-lg font-bold text-foreground">{totalModules}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="flex items-center gap-3 p-3.5">
          <div className="rounded-lg bg-secondary/10 p-2 text-secondary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Lessons
            </p>
            <p className="text-lg font-bold text-foreground">{totalLessons}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ModuleAccordionProps {
  modules: IModule[];
  courseId?: string;
  superModuleId?: string;
}

function ModuleAccordion({
  modules,
  courseId,
  superModuleId,
}: ModuleAccordionProps) {
  const sortedModules = [...modules].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const getLessonIcon = (type?: LessonType) => {
    switch (type) {
      case LessonType.ARTICLE:
        return <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />;
      case LessonType.QUIZ:
        return <HelpCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />;
      case LessonType.CODING:
        return <Code className="h-3.5 w-3.5 shrink-0 text-emerald-500" />;
      case LessonType.ASSIGNMENT:
        return <FileCheck className="h-3.5 w-3.5 shrink-0 text-purple-500" />;
      case LessonType.VIDEO:
      default:
        return <PlayCircle className="h-3.5 w-3.5 shrink-0 text-primary" />;
    }
  };

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {sortedModules.map((module) => {
        const lessons =
          (module.lessons as Array<{
            id?: string;
            _id?: string;
            title?: string;
            lessonType?: LessonType;
            displayOrder?: number;
            isPro?: boolean;
            duration?: string | number;
          }>) || [];
        const lessonCount = lessons.length;
        const currentModuleId = module.id || (module as any)._id;

        return (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="rounded-lg border border-border/70 bg-card px-4"
          >
            <div className="flex w-full items-center justify-between py-1">
              <AccordionTrigger className="flex-1 py-3 text-left hover:no-underline">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono text-xs">
                    #{module.displayOrder}
                  </Badge>
                  <div>
                    <span className="block text-sm font-semibold text-foreground">
                      {module.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
            </div>

            <AccordionContent className="border-t border-border/40 pb-4 pt-1">
              {lessonCount === 0 ? (
                <div className="flex items-center justify-between py-2 text-xs italic text-muted-foreground">
                  <span>No lessons available in this module.</span>
                </div>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {lessons.map((lesson, idx) => {
                    const resolvedLessonId = lesson.id || lesson._id || "";
                    const lessonIdKey = resolvedLessonId || `lesson-${idx}`;
                    const lessonTitle = lesson.title || `Lesson ${idx + 1}`;

                    return (
                      <li
                        key={lessonIdKey}
                        className="flex items-center justify-between rounded-md p-2 text-xs transition-colors hover:bg-muted/50"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          {getLessonIcon(lesson.lessonType)}
                          <span className="truncate font-medium text-foreground">
                            {lessonTitle}
                          </span>
                          {lesson.isPro && (
                            <Badge
                              variant="outline"
                              className="h-4 border-amber-500/50 px-1.5 py-0 text-[10px] text-amber-500"
                            >
                              PRO
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {courseId && resolvedLessonId ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-6 px-2 text-xs"
                            >
                              <Link
                                href={`/student/courses/${courseId}/super-modules/${superModuleId}/modules/${currentModuleId}/lessons/${resolvedLessonId}`}
                              >
                                Start
                              </Link>
                            </Button>
                          ) : (
                            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

interface ModuleDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: IModule;
}

function ModuleDetails({ open, onOpenChange, module }: ModuleDetailsProps) {
  const lessons =
    (module.lessons as Array<{ id?: string; title?: string }>) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-4">
            <div>
              <Badge variant="outline" className="mb-2">
                Order #{module.displayOrder}
              </Badge>
              <DialogTitle className="text-lg font-bold">
                {module.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
              <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" /> Display Order
              </span>
              <span className="font-semibold text-foreground">
                {module.displayOrder}
              </span>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
              <span className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" /> Total Lessons
              </span>
              <span className="font-semibold text-foreground">
                {lessons.length}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Attached Lessons ({lessons.length})
            </h4>
            {lessons.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">
                No lessons in this module.
              </p>
            ) : (
              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id || idx}
                    className="flex items-center gap-2 rounded border border-border/40 bg-card p-2 text-xs font-medium"
                  >
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    <span>{lesson.title || `Lesson ${idx + 1}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ModuleEmptyState() {
  return (
    <div className="my-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-8 text-center sm:p-12">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted shadow-inner">
        <Layers className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        No Modules Found
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        No modules have been published for this section.
      </p>
    </div>
  );
}

interface ModuleErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function ModuleErrorState({
  message = "Failed to load modules. Please check your connection and try again.",
  onRetry,
}: ModuleErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      className="my-4 border-destructive/50 bg-destructive/10"
    >
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="text-base font-semibold">
        Error Loading Modules
      </AlertTitle>
      <AlertDescription className="mt-1 flex flex-col justify-between gap-3 text-sm sm:flex-row sm:items-center">
        <span>{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="self-start gap-2 border-destructive/30 text-destructive hover:bg-destructive/20 dark:text-destructive-foreground sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

function ModuleSkeleton() {
  return (
    <div className="w-full space-y-3">
      {SKELETON_KEYS.map((key) => (
        <Card key={key} className="border border-border/60 shadow-sm">
          <CardHeader className="p-4 pb-3 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-5 w-1/3 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 sm:px-5">
            <div className="space-y-2 pl-15">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
