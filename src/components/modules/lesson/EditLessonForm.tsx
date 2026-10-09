"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLesson } from "@/hooks/lesson.hook";
import {
  type IUpdateLessonInput,
  LessonType,
  type TLessonResponse,
} from "@/types";
import { updateLessonSchema } from "@/validation/lesson.validation";

interface EditLessonFormProps {
  lesson: TLessonResponse;
  courseId: string;
  superModuleId: string;
  moduleId: string;
}

export type QuizOptionState = {
  id: string;
  optionText: string;
  isCorrect: boolean;
  displayOrder: number;
};

export type QuizQuestionState = {
  id: string;
  questionText: string;
  displayOrder: number;
  options: QuizOptionState[];
};

// Local key generation to eliminate array index key warnings
const generateId = (): string => crypto.randomUUID();

export function EditLessonForm({
  lesson,
  courseId,
  superModuleId,
  moduleId,
}: EditLessonFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 🟢 Dynamic Redirection Base Path (Admin vs Instructor)
  const isInstructor = pathname?.startsWith("/instructor");
  const basePath = isInstructor ? "/instructor" : "/admin";

  const { mutate: updateLesson, isPending } = useUpdateLesson();

  // 🟢 Safe extraction of sub-properties from TLessonResponse
  const articleObj = lesson.article as {
    sections?: Array<{ content?: string }>;
  } | null;
  const videoObj = lesson.video as {
    videoUrl?: string;
    durationSeconds?: number;
  } | null;
  const assignmentObj = lesson.assignment as {
    title?: string;
    instructions?: string;
    dueDate?: string;
  } | null;
  const codingObj = lesson.coding as {
    problemStatement?: string;
    inputFormat?: string;
    outputFormat?: string;
    timeLimitMs?: number;
    memoryLimitKb?: number;
  } | null;
  const quizObj = lesson.quiz as {
    questions?: Array<Record<string, unknown>>;
  } | null;

  // 🟢 Article content safe extraction
  const articleContent = articleObj?.sections?.[0]?.content || "";

  // 🟢 Quiz Initial Questions extraction with explicit typing
  const initialQuestions: QuizQuestionState[] = Array.isArray(
    quizObj?.questions,
  )
    ? quizObj.questions.map(
      (q: Record<string, unknown>, qIdx: number): QuizQuestionState => ({
        id: generateId(),
        questionText: (q.questionText as string) || "",
        displayOrder: (q.displayOrder as number) ?? qIdx + 1,
        options: Array.isArray(q.options)
          ? (q.options as Array<Record<string, unknown>>).map(
            (
              opt: Record<string, unknown>,
              oIdx: number,
            ): QuizOptionState => ({
              id: generateId(),
              optionText: (opt.optionText as string) || "",
              isCorrect: Boolean(opt.isCorrect),
              displayOrder: (opt.displayOrder as number) ?? oIdx + 1,
            }),
          )
          : [
            {
              id: generateId(),
              optionText: "",
              isCorrect: true,
              displayOrder: 1,
            },
            {
              id: generateId(),
              optionText: "",
              isCorrect: false,
              displayOrder: 2,
            },
          ],
      }),
    )
    : [
      {
        id: generateId(),
        questionText: "",
        displayOrder: 1,
        options: [
          {
            id: generateId(),
            optionText: "",
            isCorrect: true,
            displayOrder: 1,
          },
          {
            id: generateId(),
            optionText: "",
            isCorrect: false,
            displayOrder: 2,
          },
        ],
      },
    ];

  // 🟢 Assignment Due Date safe formatting for <input type="datetime-local" />
  const initialDueDate = assignmentObj?.dueDate
    ? new Date(assignmentObj.dueDate).toISOString().slice(0, 16)
    : "";

  // 🟢 Safe extraction of isFree using Intersection Type
  const isFreeValue = Boolean(
    (lesson as TLessonResponse & { isFree?: boolean }).isFree,
  );

  const form = useForm({
    defaultValues: {
      title: lesson.title || "",
      displayOrder: lesson.displayOrder ?? 1,
      isPro: Boolean(lesson.isPro),
      isFree: isFreeValue,
      articleData: lesson.article ? { content: articleContent } : undefined,
      videoData: videoObj
        ? {
          videoUrl: videoObj.videoUrl || "",
          durationSeconds: videoObj.durationSeconds || undefined,
        }
        : undefined,
      assignmentData: assignmentObj
        ? {
          title: assignmentObj.title || "",
          instructions: assignmentObj.instructions || "",
          dueDate: initialDueDate,
        }
        : undefined,
      codingData: codingObj
        ? {
          problemStatement: codingObj.problemStatement || "",
          inputFormat: codingObj.inputFormat || "",
          outputFormat: codingObj.outputFormat || "",
          timeLimitMs: codingObj.timeLimitMs || 1000,
          memoryLimitKb: codingObj.memoryLimitKb || 256000,
        }
        : undefined,
      quizData: lesson.quiz
        ? {
          questions: initialQuestions,
        }
        : undefined,
    },
    onSubmit: async ({ value }) => {
      const currentType = lesson.lessonType;

      // 🟢 Payload cleanup based on current lesson type
      const payload: IUpdateLessonInput = {
        title: value.title,
        displayOrder: Number(value.displayOrder) || 1,
        isPro: Boolean(value.isPro),
        isFree: Boolean(value.isFree),
      };

      if (currentType === LessonType.ARTICLE) {
        payload.articleData = value.articleData;
      } else if (currentType === LessonType.VIDEO) {
        payload.videoData = value.videoData;
      } else if (currentType === LessonType.ASSIGNMENT) {
        if (value.assignmentData) {
          const rawDate = value.assignmentData.dueDate;
          payload.assignmentData = {
            title: value.assignmentData.title,
            instructions: value.assignmentData.instructions,
            dueDate:
              rawDate && typeof rawDate === "string" && rawDate.trim() !== ""
                ? new Date(rawDate).toISOString()
                : undefined,
          };
        }
      } else if (currentType === LessonType.CODING) {
        if (value.codingData) {
          payload.codingData = {
            problemStatement: value.codingData.problemStatement,
            inputFormat: value.codingData.inputFormat,
            outputFormat: value.codingData.outputFormat,
            timeLimitMs: Number(value.codingData.timeLimitMs) || 1000,
            memoryLimitKb: Number(value.codingData.memoryLimitKb) || 256000,
          };
        }
      } else if (currentType === LessonType.QUIZ) {
        if (value.quizData?.questions) {
          payload.quizData = {
            questions: value.quizData.questions.map(
              (q: QuizQuestionState, qIdx: number) => ({
                questionText: q.questionText,
                displayOrder: qIdx + 1,
                options: (q.options || []).map(
                  (opt: QuizOptionState, oIdx: number) => ({
                    optionText: opt.optionText,
                    displayOrder: oIdx + 1,
                    isCorrect: Boolean(opt.isCorrect),
                  }),
                ),
              }),
            ),
          };
        }
      }

      // 🟢 Validate against Zod schema
      const parseResult = updateLessonSchema.safeParse(payload);
      if (!parseResult.success) {
        console.error("Validation Error:", parseResult.error.format());
        const errorMessages = parseResult.error.issues
          .map((issue) => `${issue.path.join(".") || "Form"}: ${issue.message}`)
          .join("\n");
        alert(`Please fix the validation errors:\n\n${errorMessages}`);
        return;
      }

      updateLesson(
        { id: lesson.id, payload: parseResult.data as IUpdateLessonInput },
        {
          onSuccess: () => {
            // 🟢 Dynamic Redirection Path
            router.push(
              `${basePath}/courses/${courseId}/super-modules/${superModuleId}/modules/${moduleId}/lessons`,
            );
            router.refresh();
          },
          onError: (error) => {
            console.error("Update Error:", error);
            alert(error.message || "Failed to update lesson");
          },
        },
      );
    },
  });

  const currentLessonType = lesson.lessonType;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Lesson</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">Type:</span>
              <Badge variant="secondary">{currentLessonType}</Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? "Updating..." : "Update Lesson"}
          </Button>
        </div>
      </div>

      {/* Basic Lesson Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Basic Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value ? "Lesson title is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Lesson Title *</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter lesson title..."
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <form.Field name="displayOrder">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Display Order *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === "" ? 1 : Number(e.target.value),
                      )
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="isPro">
              {(field) => (
                <div className="flex items-center space-x-2 pb-3">
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium cursor-pointer"
                  >
                    Pro Content
                  </Label>
                </div>
              )}
            </form.Field>

            <form.Field name="isFree">
              {(field) => (
                <div className="flex items-center space-x-2 pb-3">
                  <Checkbox
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium cursor-pointer"
                  >
                    Free Preview
                  </Label>
                </div>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Article Payload */}
      {currentLessonType === LessonType.ARTICLE && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Article Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form.Field name="articleData.content">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Article Markdown</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={10}
                    className="font-mono text-sm"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="# Write article markdown here..."
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {/* Video Payload */}
      {currentLessonType === LessonType.VIDEO && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="videoData.videoUrl">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Video URL *</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="videoData.durationSeconds">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Duration (Seconds)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder="e.g. 300"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {/* Assignment Payload */}
      {currentLessonType === LessonType.ASSIGNMENT && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Assignment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="assignmentData.title">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>
                    Assignment Title (Optional)
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Build a Fullstack App"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="assignmentData.instructions">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Instructions *</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={6}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Write detailed instructions..."
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="assignmentData.dueDate">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Due Date & Time (Optional)</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="datetime-local"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {/* Coding Payload */}
      {currentLessonType === LessonType.CODING && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Judge0 Coding Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form.Field name="codingData.problemStatement">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Problem Statement *</Label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={6}
                    className="font-mono text-sm"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Write the problem statement..."
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="codingData.inputFormat">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Input Format (Optional)</Label>
                    <Textarea
                      id={field.name}
                      rows={3}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Input format description..."
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="codingData.outputFormat">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Output Format (Optional)</Label>
                    <Textarea
                      id={field.name}
                      rows={3}
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Output format description..."
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="codingData.timeLimitMs">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Time Limit (MS)</Label>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value ?? 1000}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 1000)
                      }
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="codingData.memoryLimitKb">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Memory Limit (KB)</Label>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value ?? 256000}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 256000)
                      }
                    />
                  </div>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Payload */}
      {currentLessonType === LessonType.QUIZ && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Quiz Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form.Field name="quizData">
              {(quizField) => {
                const questions = quizField.state.value?.questions || [];

                const handleAddQuestion = () => {
                  const nextOrder = questions.length + 1;
                  const updated: QuizQuestionState[] = [
                    ...questions,
                    {
                      id: generateId(),
                      questionText: "",
                      displayOrder: nextOrder,
                      options: [
                        {
                          id: generateId(),
                          optionText: "",
                          isCorrect: true,
                          displayOrder: 1,
                        },
                        {
                          id: generateId(),
                          optionText: "",
                          isCorrect: false,
                          displayOrder: 2,
                        },
                      ],
                    },
                  ];
                  quizField.handleChange({ questions: updated });
                };

                const handleRemoveQuestion = (qIndex: number) => {
                  if (questions.length <= 1) {
                    alert("Quiz must have at least one question.");
                    return;
                  }
                  const updated = questions
                    .filter(
                      (_: QuizQuestionState, idx: number) => idx !== qIndex,
                    )
                    .map((q: QuizQuestionState, idx: number) => ({
                      ...q,
                      displayOrder: idx + 1,
                    }));
                  quizField.handleChange({ questions: updated });
                };

                const handleQuestionTextChange = (
                  qIndex: number,
                  text: string,
                ) => {
                  const updated = [...questions];
                  updated[qIndex] = {
                    ...updated[qIndex],
                    questionText: text,
                  };
                  quizField.handleChange({ questions: updated });
                };

                const handleAddOption = (qIndex: number) => {
                  const question = questions[qIndex];
                  const nextOptionOrder = (question.options?.length || 0) + 1;
                  const updatedOptions: QuizOptionState[] = [
                    ...(question.options || []),
                    {
                      id: generateId(),
                      optionText: "",
                      isCorrect: false,
                      displayOrder: nextOptionOrder,
                    },
                  ];
                  const updated = [...questions];
                  updated[qIndex] = { ...question, options: updatedOptions };
                  quizField.handleChange({ questions: updated });
                };

                const handleRemoveOption = (qIndex: number, oIndex: number) => {
                  const question = questions[qIndex];
                  if (question.options.length <= 1) {
                    alert("A question must have at least one option.");
                    return;
                  }
                  const updatedOptions = question.options
                    .filter((_: QuizOptionState, idx: number) => idx !== oIndex)
                    .map((opt: QuizOptionState, idx: number) => ({
                      ...opt,
                      displayOrder: idx + 1,
                    }));

                  const hasCorrect = updatedOptions.some(
                    (opt: QuizOptionState) => opt.isCorrect,
                  );
                  if (!hasCorrect && updatedOptions.length > 0) {
                    updatedOptions[0].isCorrect = true;
                  }

                  const updated = [...questions];
                  updated[qIndex] = { ...question, options: updatedOptions };
                  quizField.handleChange({ questions: updated });
                };

                const handleOptionTextChange = (
                  qIndex: number,
                  oIndex: number,
                  text: string,
                ) => {
                  const question = questions[qIndex];
                  const updatedOptions = [...question.options];
                  updatedOptions[oIndex] = {
                    ...updatedOptions[oIndex],
                    optionText: text,
                  };
                  const updated = [...questions];
                  updated[qIndex] = { ...question, options: updatedOptions };
                  quizField.handleChange({ questions: updated });
                };

                const handleToggleCorrectOption = (
                  qIndex: number,
                  oIndex: number,
                ) => {
                  const question = questions[qIndex];
                  const updatedOptions = question.options.map(
                    (opt: QuizOptionState, idx: number) => ({
                      ...opt,
                      isCorrect:
                        idx === oIndex ? !opt.isCorrect : opt.isCorrect,
                    }),
                  );
                  const updated = [...questions];
                  updated[qIndex] = { ...question, options: updatedOptions };
                  quizField.handleChange({ questions: updated });
                };

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Questions List ({questions.length})
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddQuestion}
                        className="flex items-center gap-1.5 text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                      >
                        <Plus className="w-4 h-4" /> Add Question
                      </Button>
                    </div>

                    {questions.map((q: QuizQuestionState, qIndex: number) => {
                      const hasCorrectOption = q.options?.some(
                        (opt: QuizOptionState) => opt.isCorrect,
                      );

                      return (
                        <Card
                          key={q.id}
                          className="border border-muted bg-card"
                        >
                          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                Question #{qIndex + 1}
                              </span>
                              {!hasCorrectOption && (
                                <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Select at
                                  least 1 correct option
                                </span>
                              )}
                            </div>
                            {questions.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveQuestion(qIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </CardHeader>
                          <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Question Title / Statement *</Label>
                              <Input
                                placeholder="e.g. What is the output of sizeof(int) in C++?"
                                value={q.questionText}
                                onChange={(e) =>
                                  handleQuestionTextChange(
                                    qIndex,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            {/* Options List */}
                            <div className="space-y-3 pt-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold uppercase text-muted-foreground">
                                  Answer Options
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddOption(qIndex)}
                                  className="h-7 text-xs flex items-center gap-1 text-primary"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Option
                                </Button>
                              </div>

                              <div className="space-y-2">
                                {q.options?.map(
                                  (opt: QuizOptionState, oIndex: number) => (
                                    <div
                                      key={opt.id}
                                      className="flex items-center gap-2"
                                    >
                                      <Checkbox
                                        checked={opt.isCorrect}
                                        onCheckedChange={() =>
                                          handleToggleCorrectOption(
                                            qIndex,
                                            oIndex,
                                          )
                                        }
                                        id={`opt-${qIndex}-${oIndex}`}
                                      />
                                      <Input
                                        placeholder={`Option ${oIndex + 1}`}
                                        value={opt.optionText}
                                        onChange={(e) =>
                                          handleOptionTextChange(
                                            qIndex,
                                            oIndex,
                                            e.target.value,
                                          )
                                        }
                                        className="flex-1 text-sm"
                                      />
                                      {q.options.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                          onClick={() =>
                                            handleRemoveOption(qIndex, oIndex)
                                          }
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                );
              }}
            </form.Field>
          </CardContent>
        </Card>
      )}
    </form>
  );
}