"use client";

import {
  BookOpen,
  Code,
  Edit,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteLesson } from "@/hooks/lesson.hook";
import type { IModule } from "@/types";
import { LessonType } from "@/types";

interface ModuleAccordionProps {
  modules: IModule[];
  canManage?: boolean;
  courseId?: string;
  superModuleId?: string;
  isStudent?: boolean;
  isInstructor?: boolean;
  isAdmin?: boolean;
  onEdit?: (module: IModule) => void;
  onDelete?: (module: IModule) => void;
}

export function ModuleAccordion({
  modules,
  canManage = false,
  courseId,
  superModuleId,
  isStudent = false,
  isInstructor = false,
  isAdmin = false,
  onEdit,
  onDelete,
}: ModuleAccordionProps) {
  const { mutate: deleteLesson } = useDeleteLesson();

  // Dynamic Base Path Logic
  const basePath = isInstructor ? "/instructor" : "/admin";

  const sortedModules = [...modules].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  const getLessonIcon = (type?: LessonType) => {
    switch (type) {
      case LessonType.ARTICLE:
        return <FileText className="h-3.5 w-3.5 text-blue-500 shrink-0" />;
      case LessonType.QUIZ:
        return <HelpCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
      case LessonType.CODING:
        return <Code className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
      case LessonType.ASSIGNMENT:
        return <FileCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />;
      case LessonType.VIDEO:
      default:
        return <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />;
    }
  };

  const handleDeleteLesson = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete lesson: "${title}"?`)) {
      deleteLesson(id);
    }
  };

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {sortedModules.map((module) => {
        const currentSuperModuleId =
          superModuleId || (module as { superModuleId?: string }).superModuleId;

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

        const createLessonUrl = `${basePath}/courses/${courseId}/super-modules/${currentSuperModuleId}/modules/${module.id}/lessons/create`;

        return (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border rounded-lg bg-card px-4 border-border/70"
          >
            <div className="flex items-center justify-between w-full py-1">
              <AccordionTrigger className="hover:no-underline py-3 flex-1 text-left">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="font-mono text-xs">
                    #{module.displayOrder}
                  </Badge>
                  <div>
                    <span className="font-semibold text-sm text-foreground block">
                      {module.title}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal flex items-center gap-1 mt-0.5">
                      <BookOpen className="h-3 w-3" />
                      {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              {canManage && (
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  {courseId && currentSuperModuleId && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 text-xs gap-1 border-dashed"
                    >
                      <Link href={createLessonUrl}>
                        <Plus className="h-3.5 w-3.5" />
                        Add Lesson
                      </Link>
                    </Button>
                  )}

                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(module);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Module</span>
                    </Button>
                  )}

                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(module);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Module</span>
                    </Button>
                  )}
                </div>
              )}
            </div>

            <AccordionContent className="pt-1 pb-4 border-t border-border/40">
              {lessonCount === 0 ? (
                <div className="text-xs text-muted-foreground py-2 italic flex items-center justify-between">
                  <span>No lessons available in this module.</span>
                  {canManage && courseId && currentSuperModuleId && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 text-xs gap-1"
                    >
                      <Link href={createLessonUrl}>
                        <Plus className="h-3 w-3" /> Add Lesson
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <ul className="space-y-1.5 mt-2">
                  {lessons.map((lesson, idx) => {
                    const resolvedLessonId = lesson.id || lesson._id || "";
                    const lessonIdKey = resolvedLessonId || `lesson-${idx}`;
                    const lessonTitle = lesson.title || `Lesson ${idx + 1}`;

                    const manageLessonUrl = `${basePath}/courses/${courseId}/super-modules/${currentSuperModuleId}/modules/${module.id}/lessons/${resolvedLessonId}`;
                    const editLessonUrl = `${basePath}/courses/${courseId}/super-modules/${currentSuperModuleId}/modules/${module.id}/lessons/${resolvedLessonId}/edit`;

                    return (
                      <li
                        key={lessonIdKey}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getLessonIcon(lesson.lessonType)}
                          <span className="truncate text-foreground font-medium">
                            {lessonTitle}
                          </span>
                          {lesson.isPro && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 border-amber-500/50 text-amber-500"
                            >
                              PRO
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {canManage && resolvedLessonId && (
                            <>
                              {courseId && currentSuperModuleId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  title="Manage Lesson Content"
                                >
                                  <Link href={manageLessonUrl}>
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </Button>
                              )}

                              {courseId && currentSuperModuleId && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  asChild
                                  className="h-6 w-6 text-muted-foreground hover:text-amber-600"
                                  title="Edit Lesson"
                                >
                                  <Link href={editLessonUrl}>
                                    <Edit className="h-3 w-3" />
                                  </Link>
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                title="Delete Lesson"
                                onClick={() =>
                                  handleDeleteLesson(
                                    resolvedLessonId,
                                    lessonTitle,
                                  )
                                }
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}

                          {isStudent && courseId && resolvedLessonId ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="h-6 text-xs px-2"
                            >
                              <Link
                                href={`/student/my-courses/${courseId}/lessons/${resolvedLessonId}`}
                              >
                                Start
                              </Link>
                            </Button>
                          ) : !isStudent && !canManage ? (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          ) : null}
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