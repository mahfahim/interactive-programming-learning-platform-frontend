"use client";

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Edit,
  EyeOff,
  FileCheck,
  HardDrive,
  HelpCircle,
  PlayCircle,
  Terminal,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLessonById } from "@/hooks/lesson.hook";
import { LessonType } from "@/types";

// 🟢 Helper: Extract YouTube Embed URL
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  let videoId = "";

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v") || "";
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

// Types
interface QuizOptionDetails {
  id?: string;
  optionText?: string;
  isCorrect?: boolean;
  displayOrder?: number;
}

interface QuizQuestionDetails {
  id?: string;
  questionText?: string;
  displayOrder?: number;
  options?: QuizOptionDetails[];
}

interface CodingTestCaseDetails {
  id?: string;
  inputData?: string;
  expectedOutput?: string;
  isHidden?: boolean;
  displayOrder?: number;
}

interface AssignmentDataDetails {
  title?: string;
  instructions?: string;
  dueDate?: string | Date;
}

interface CodingDataDetails {
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  testCases?: CodingTestCaseDetails[];
}

interface QuizDataDetails {
  questions?: QuizQuestionDetails[];
}

export function AdminLessonDetails({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { data: response, isLoading } = useGetLessonById(lessonId);
  const lesson = response?.data;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      // Implement delete mutation here
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center gap-3 border-b pb-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Lesson Not Found</CardTitle>
            <CardDescription>
              The requested lesson could not be located or may have been
              removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const articleContent =
    (
      lesson.article as unknown as {
        sections?: Array<{ content?: string }>;
      }
    )?.sections?.[0]?.content || "No article content provided.";

  const videoData =
    (lesson.video as unknown as {
      videoUrl?: string;
      durationSeconds?: number;
    }) || null;
  const assignmentData =
    (lesson.assignment as unknown as AssignmentDataDetails) || null;
  const codingData = (lesson.coding as unknown as CodingDataDetails) || null;
  const quizData = (lesson.quiz as unknown as QuizDataDetails) || null;

  const embedUrl = videoData?.videoUrl
    ? getYouTubeEmbedUrl(videoData.videoUrl)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Navigation, Admin Actions & Title Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <Badge
              variant="secondary"
              className="uppercase font-semibold text-[11px]"
            >
              {lesson.lessonType}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight mt-1">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* 🟢 Admin / Instructor CRUD Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/lessons/${lessonId}/edit`)}
          >
            <Edit className="w-4 h-4 mr-1.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {/* 🟢 1. ARTICLE TYPE */}
          {lesson.lessonType === LessonType.ARTICLE && (
            <article className="prose dark:prose-invert max-w-none space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-6 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Reading Material</span>
              </div>

              <div className="article-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold tracking-tight mt-6 mb-4 text-foreground border-b pb-2">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold tracking-tight mt-6 mb-3 text-foreground">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold tracking-tight mt-4 mb-2 text-foreground">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm md:text-base leading-relaxed text-muted-foreground/90 mb-4">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 mb-4 text-sm md:text-base text-muted-foreground pl-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 mb-4 text-sm md:text-base text-muted-foreground pl-2">
                        {children}
                      </ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/70 pl-4 italic text-muted-foreground my-4 bg-muted/40 py-2.5 px-3 rounded-r-md">
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-4 font-medium hover:text-primary/80"
                      >
                        {children}
                      </a>
                    ),
                    code: ({
                      className,
                      children,
                      ...props
                    }: React.ComponentPropsWithoutRef<"code">) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                          <div className="bg-slate-900 px-4 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800">
                            {match[1]}
                          </div>
                          <pre className="p-4 font-mono text-xs md:text-sm text-slate-100 overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code
                          className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono font-medium text-foreground"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {articleContent}
                </ReactMarkdown>
              </div>
            </article>
          )}

          {/* 🟢 2. VIDEO TYPE */}
          {lesson.lessonType === LessonType.VIDEO && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" /> Video Lesson
              </h3>

              {embedUrl ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border bg-black shadow-md">
                    <iframe
                      src={embedUrl}
                      title={lesson.title}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>
                      Duration:{" "}
                      <strong className="text-foreground font-semibold">
                        {videoData?.durationSeconds ?? 0}
                      </strong>{" "}
                      seconds
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    Invalid or unsupported video URL.
                  </p>
                  {videoData?.videoUrl && (
                    <a
                      href={videoData.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary underline break-all"
                    >
                      {videoData.videoUrl}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🟢 3. ASSIGNMENT TYPE */}
          {lesson.lessonType === LessonType.ASSIGNMENT && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">
                    {assignmentData?.title || lesson.title}
                  </h3>
                </div>
                {assignmentData?.dueDate && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 w-fit text-xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Due: {new Date(assignmentData.dueDate).toLocaleString()}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Instructions & Requirements
                </h4>
                <div className="p-5 bg-muted/30 rounded-lg border">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-sm leading-relaxed text-foreground mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground mb-3">
                          {children}
                        </ul>
                      ),
                    }}
                  >
                    {assignmentData?.instructions ||
                      "No instructions provided."}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* 🟢 4. CODING TYPE */}
          {lesson.lessonType === LessonType.CODING && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">
                    Judge0 Coding Problem
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {codingData?.timeLimitMs ?? 1000} ms
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 text-xs"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    {codingData?.memoryLimitKb ?? 256000} KB
                  </Badge>
                </div>
              </div>

              {/* Problem Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Problem Statement
                </h4>
                <div className="p-4 bg-slate-950 text-slate-100 rounded-lg font-mono text-sm leading-relaxed border border-slate-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {codingData?.problemStatement ||
                      "No problem statement provided."}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Input & Output Formats */}
              {(codingData?.inputFormat || codingData?.outputFormat) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {codingData?.inputFormat && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Input Format
                      </h4>
                      <div className="p-3 bg-muted/40 rounded-md border text-xs font-mono whitespace-pre-wrap">
                        {codingData.inputFormat}
                      </div>
                    </div>
                  )}
                  {codingData?.outputFormat && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Output Format
                      </h4>
                      <div className="p-3 bg-muted/40 rounded-md border text-xs font-mono whitespace-pre-wrap">
                        {codingData.outputFormat}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Test Cases List (Including Hidden) */}
              {codingData?.testCases && codingData.testCases.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Test Cases (
                    {codingData.testCases.length})
                  </h4>
                  <div className="space-y-3">
                    {codingData.testCases.map(
                      (tc: CodingTestCaseDetails, tcIdx: number) => {
                        const testCaseKey =
                          tc.id ||
                          `tc-${tc.displayOrder ?? tcIdx + 1}-${tc.inputData?.slice(0, 10) || tcIdx}`;
                        return (
                          <div
                            key={testCaseKey}
                            className="border rounded-lg p-3 bg-card space-y-2 text-xs font-mono"
                          >
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="font-semibold text-foreground">
                                Test Case #{tc.displayOrder ?? tcIdx + 1}
                              </span>
                              {tc.isHidden && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] text-amber-500 border-amber-500/30 flex items-center gap-1"
                                >
                                  <EyeOff className="w-3 h-3" /> Hidden Test
                                  Case
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-1">
                                  Input Data:
                                </span>
                                <pre className="p-2 bg-muted/50 rounded border overflow-x-auto text-foreground">
                                  {tc.inputData || "(empty)"}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] text-muted-foreground uppercase block mb-1">
                                  Expected Output:
                                </span>
                                <pre className="p-2 bg-muted/50 rounded border overflow-x-auto text-foreground">
                                  {tc.expectedOutput || "(empty)"}
                                </pre>
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🟢 5. QUIZ TYPE (Shows Correct Answer Key) */}
          {lesson.lessonType === LessonType.QUIZ && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-semibold">
                    Quiz Overview (Instructor View)
                  </h3>
                </div>
                <Badge variant="secondary">
                  Total Questions: {quizData?.questions?.length ?? 0}
                </Badge>
              </div>

              {quizData?.questions && quizData.questions.length > 0 ? (
                <div className="space-y-6">
                  {quizData.questions.map(
                    (q: QuizQuestionDetails, qIdx: number) => {
                      const questionKey =
                        q.id ||
                        `q-${q.displayOrder ?? qIdx + 1}-${q.questionText?.slice(0, 15) || qIdx}`;
                      return (
                        <div
                          key={questionKey}
                          className="border rounded-lg p-4 bg-card space-y-3 shadow-xs"
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-sm bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              Q{q.displayOrder ?? qIdx + 1}
                            </span>
                            <h4 className="font-medium text-sm md:text-base pt-0.5 text-foreground">
                              {q.questionText}
                            </h4>
                          </div>

                          {/* Options with Correct Indicators */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                            {q.options?.map(
                              (opt: QuizOptionDetails, oIdx: number) => {
                                const optionKey =
                                  opt.id ||
                                  `opt-${opt.displayOrder ?? oIdx + 1}-${opt.optionText?.slice(0, 15) || oIdx}`;
                                return (
                                  <div
                                    key={optionKey}
                                    className={`flex items-center justify-between p-2.5 rounded-md border text-xs transition-colors ${
                                      opt.isCorrect
                                        ? "border-emerald-500 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
                                        : "bg-muted/30 text-muted-foreground"
                                    }`}
                                  >
                                    <span>{opt.optionText}</span>
                                    {opt.isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="p-6 bg-muted/40 rounded-lg text-center border text-sm text-muted-foreground">
                  No questions available in this quiz.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
