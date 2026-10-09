"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  Code,
  FileCheck,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { lessonKeys, useCreateLesson } from "@/hooks/lesson.hook";
import { moduleKeys } from "@/hooks/module.hook";
import { superModuleKeys } from "@/hooks/superModule.hook";
import { type ICreateLessonInput, LessonType } from "@/types";
import { createLessonSchema } from "@/validation/lesson.validation";

interface CreateLessonFormProps {
  courseId: string;
  superModuleId: string;
  moduleId: string;
}

// Helper function to generate unique IDs for local React keys
const generateId = () => crypto.randomUUID();

export function CreateLessonForm({
  courseId,
  superModuleId,
  moduleId,
}: CreateLessonFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createLesson, isPending } = useCreateLesson();

  const [selectedType, setSelectedType] = useState<LessonType>(
    LessonType.ARTICLE,
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const form = useForm({
    defaultValues: {
      title: "",
      moduleId: moduleId,
      type: LessonType.ARTICLE,
      displayOrder: 1,
      isPro: false,
      isFree: false,
      articleData: {
        content: "",
      },
      videoData: {
        videoUrl: "",
        durationSeconds: undefined as number | undefined,
      },
      assignmentData: {
        title: "",
        instructions: "",
        dueDate: "",
      },
      codingData: {
        problemStatement: "",
        inputFormat: "",
        outputFormat: "",
        timeLimitMs: 1000,
        memoryLimitKb: 256000,
        testCases: [
          {
            id: generateId(),
            inputData: "",
            expectedOutput: "",
            isHidden: false,
            displayOrder: 1,
          },
        ],
      },
      quizData: {
        questions: [
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
        ],
      },
    },
    onSubmit: async ({ value }) => {
      const payload: ICreateLessonInput = {
        ...value,
        moduleId,
        type: selectedType,
        displayOrder: Number(value.displayOrder) || 1,
      };

      // 🟢 Payload specific cleanup based on lesson type (stripping client-only `id` fields)
      if (selectedType === LessonType.ARTICLE) {
        payload.videoData = undefined;
        payload.quizData = undefined;
        payload.assignmentData = undefined;
        payload.codingData = undefined;
      } else if (selectedType === LessonType.VIDEO) {
        payload.articleData = undefined;
        payload.quizData = undefined;
        payload.assignmentData = undefined;
        payload.codingData = undefined;
      } else if (selectedType === LessonType.QUIZ) {
        payload.articleData = undefined;
        payload.videoData = undefined;
        payload.assignmentData = undefined;
        payload.codingData = undefined;

        if (payload.quizData?.questions) {
          payload.quizData.questions = payload.quizData.questions.map(
            (q, qIdx) => ({
              questionText: q.questionText,
              displayOrder: qIdx + 1,
              options: (q.options || []).map((opt, oIdx) => ({
                optionText: opt.optionText,
                displayOrder: oIdx + 1,
                isCorrect: Boolean(opt.isCorrect),
              })),
            }),
          );
        }
      } else if (selectedType === LessonType.ASSIGNMENT) {
        payload.articleData = undefined;
        payload.videoData = undefined;
        payload.quizData = undefined;
        payload.codingData = undefined;

        if (payload.assignmentData) {
          const rawDate = payload.assignmentData.dueDate;
          if (rawDate && typeof rawDate === "string" && rawDate.trim() !== "") {
            payload.assignmentData.dueDate = new Date(rawDate).toISOString();
          } else {
            payload.assignmentData.dueDate = undefined;
          }
        }
      } else if (selectedType === LessonType.CODING) {
        payload.articleData = undefined;
        payload.videoData = undefined;
        payload.quizData = undefined;
        payload.assignmentData = undefined;

        if (payload.codingData) {
          payload.codingData.timeLimitMs =
            Number(payload.codingData.timeLimitMs) || 1000;
          payload.codingData.memoryLimitKb =
            Number(payload.codingData.memoryLimitKb) || 256000;

          if (payload.codingData.testCases) {
            payload.codingData.testCases = payload.codingData.testCases.map(
              (tc, tcIdx) => ({
                inputData: tc.inputData,
                expectedOutput: tc.expectedOutput,
                displayOrder: tcIdx + 1,
                isHidden: Boolean(tc.isHidden),
              }),
            );
          }
        }
      }

      // 🟢 Zod Schema Validation Check
      const parseResult = createLessonSchema.safeParse(payload);
      if (!parseResult.success) {
        console.error("Zod Validation Errors:", parseResult.error.format());
        const errorMessages = parseResult.error.issues
          .map((issue) => `${issue.path.join(".") || "Form"}: ${issue.message}`)
          .join("\n");
        alert(
          `Please fix the following validation errors:\n\n${errorMessages}`,
        );
        return;
      }

      // 🟢 Cache invalidate সম্পন্ন করে তারপর Navigation চালানো হচ্ছে
      createLesson(parseResult.data as ICreateLessonInput, {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: moduleKeys.all }),
            queryClient.invalidateQueries({ queryKey: lessonKeys.all }),
            queryClient.invalidateQueries({ queryKey: superModuleKeys.all }),
          ]);

          router.push(
            `/admin/courses/${courseId}/super-modules/${superModuleId}/modules/${moduleId}/lessons`,
          );
          router.refresh();
        },
        onError: (error) => {
          console.error("API Error:", error);
          alert(error.message || "Failed to create lesson");
        },
      });
    },
  });

  const lessonTypes = [
    { type: LessonType.ARTICLE, label: "Article", icon: FileText },
    { type: LessonType.VIDEO, label: "Video", icon: Video },
    { type: LessonType.QUIZ, label: "Quiz", icon: HelpCircle },
    { type: LessonType.ASSIGNMENT, label: "Assignment", icon: FileCheck },
    { type: LessonType.CODING, label: "Judge0 Code", icon: Code },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Lesson
            </h1>
            <p className="text-xs text-muted-foreground">
              Module ID: {moduleId}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-lesson-form"
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? "Saving..." : "Save Lesson"}
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <form
        id="create-lesson-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        {/* 1. Basic Metadata Card */}
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
                  !value ? "Title is required" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Lesson Title *</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Variables & Data Types in C++"
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
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value) || 1)
                      }
                    />
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
                    <Label htmlFor={field.name} className="cursor-pointer">
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
                    <Label htmlFor={field.name} className="cursor-pointer">
                      Free Preview
                    </Label>
                  </div>
                )}
              </form.Field>
            </div>

            {/* Select Lesson Type Tabs */}
            <div className="space-y-2 pt-2">
              <Label>SELECT LESSON TYPE *</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {lessonTypes.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(item.type);
                        form.setFieldValue("type", item.type);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 font-semibold"
                          : "border-border bg-card hover:bg-accent/50 text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-2" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Content Payload based on Selected Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              2. Content Payload ({selectedType})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ARTICLE PAYLOAD */}
            {selectedType === LessonType.ARTICLE && (
              <div className="space-y-4">
                <div className="flex gap-2 border-b pb-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={activeTab === "write" ? "default" : "outline"}
                    onClick={() => setActiveTab("write")}
                  >
                    Write
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={activeTab === "preview" ? "default" : "outline"}
                    onClick={() => setActiveTab("preview")}
                  >
                    Preview
                  </Button>
                </div>

                {activeTab === "write" ? (
                  <form.Field name="articleData.content">
                    {(field) => (
                      <Textarea
                        rows={10}
                        className="font-mono text-sm"
                        placeholder="# Write lesson content using Markdown..."
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                ) : (
                  <div className="p-4 bg-muted rounded-md min-h-50 font-mono text-sm whitespace-pre-wrap">
                    {form.getFieldValue("articleData.content") ||
                      "Nothing to preview"}
                  </div>
                )}
              </div>
            )}

            {/* VIDEO PAYLOAD */}
            {selectedType === LessonType.VIDEO && (
              <div className="space-y-4">
                <form.Field name="videoData.videoUrl">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Video URL *</Label>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="videoData.durationSeconds">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Duration (Seconds)</Label>
                      <Input
                        type="number"
                        placeholder="600"
                        value={field.state.value ?? ""}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {/* ASSIGNMENT PAYLOAD */}
            {selectedType === LessonType.ASSIGNMENT && (
              <div className="space-y-4">
                <form.Field name="assignmentData.title">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Assignment Title (Optional)
                      </Label>
                      <Input
                        id={field.name}
                        placeholder="e.g. Build a Student Management System in C++"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                        rows={6}
                        placeholder="Write detailed assignment instructions, submission guidelines, criteria..."
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="assignmentData.dueDate">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>
                        Due Date & Time (Optional)
                      </Label>
                      <Input
                        id={field.name}
                        type="datetime-local"
                        value={
                          field.state.value
                            ? String(field.state.value).slice(0, 16)
                            : ""
                        }
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {/* CODING (JUDGE0) PAYLOAD */}
            {selectedType === LessonType.CODING && (
              <form.Field name="codingData">
                {(codingField) => {
                  const value = codingField.state.value || {
                    problemStatement: "",
                    inputFormat: "",
                    outputFormat: "",
                    timeLimitMs: 1000,
                    memoryLimitKb: 256000,
                    testCases: [],
                  };

                  const handleUpdate = (updates: Partial<typeof value>) => {
                    codingField.handleChange({ ...value, ...updates });
                  };

                  const testCases = value.testCases || [];

                  const handleAddTestCase = () => {
                    const nextOrder = testCases.length + 1;
                    const updated = [
                      ...testCases,
                      {
                        id: generateId(),
                        inputData: "",
                        expectedOutput: "",
                        isHidden: false,
                        displayOrder: nextOrder,
                      },
                    ];
                    handleUpdate({ testCases: updated });
                  };

                  const handleRemoveTestCase = (tcIndex: number) => {
                    const updated = testCases
                      .filter((_, idx) => idx !== tcIndex)
                      .map((tc, idx) => ({ ...tc, displayOrder: idx + 1 }));
                    handleUpdate({ testCases: updated });
                  };

                  const handleTestCaseChange = (
                    tcIndex: number,
                    fieldName: string,
                    val: any,
                  ) => {
                    const updated = [...testCases];
                    updated[tcIndex] = {
                      ...updated[tcIndex],
                      [fieldName]: val,
                    };
                    handleUpdate({ testCases: updated });
                  };

                  return (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Problem Statement *</Label>
                        <Textarea
                          rows={6}
                          className="font-mono text-sm"
                          placeholder="Write problem statement in detail (Markdown supported)..."
                          value={value.problemStatement || ""}
                          onChange={(e) =>
                            handleUpdate({ problemStatement: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Input Format (Optional)</Label>
                          <Textarea
                            rows={3}
                            placeholder="e.g. First line contains integer N..."
                            value={value.inputFormat || ""}
                            onChange={(e) =>
                              handleUpdate({ inputFormat: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Output Format (Optional)</Label>
                          <Textarea
                            rows={3}
                            placeholder="e.g. Print single integer representing..."
                            value={value.outputFormat || ""}
                            onChange={(e) =>
                              handleUpdate({ outputFormat: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Time Limit (ms)</Label>
                          <Input
                            type="number"
                            placeholder="1000"
                            value={value.timeLimitMs ?? 1000}
                            onChange={(e) =>
                              handleUpdate({
                                timeLimitMs: Number(e.target.value) || 1000,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Memory Limit (KB)</Label>
                          <Input
                            type="number"
                            placeholder="256000"
                            value={value.memoryLimitKb ?? 256000}
                            onChange={(e) =>
                              handleUpdate({
                                memoryLimitKb: Number(e.target.value) || 256000,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Test Cases List */}
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <Label className="text-base font-semibold">
                              Judge0 Test Cases ({testCases.length})
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Add sample and hidden test cases for auto-grading.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddTestCase}
                            className="flex items-center gap-1.5 text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          >
                            <Plus className="w-4 h-4" /> Add Test Case
                          </Button>
                        </div>

                        {testCases.map((tc, tcIndex) => (
                          <Card
                            key={tc.id}
                            className="border border-muted bg-card"
                          >
                            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/20">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-sm">
                                  Test Case #{tcIndex + 1}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`tc-hidden-${tc.id}`}
                                    checked={tc.isHidden ?? false}
                                    onCheckedChange={(checked) =>
                                      handleTestCaseChange(
                                        tcIndex,
                                        "isHidden",
                                        Boolean(checked),
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`tc-hidden-${tc.id}`}
                                    className="text-xs cursor-pointer"
                                  >
                                    Is Hidden (Secret test case)
                                  </Label>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveTestCase(tcIndex)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </CardHeader>
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs">Input Data</Label>
                                <Textarea
                                  rows={3}
                                  className="font-mono text-xs"
                                  placeholder="Input data..."
                                  value={tc.inputData || ""}
                                  onChange={(e) =>
                                    handleTestCaseChange(
                                      tcIndex,
                                      "inputData",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">
                                  Expected Output
                                </Label>
                                <Textarea
                                  rows={3}
                                  className="font-mono text-xs"
                                  placeholder="Expected output..."
                                  value={tc.expectedOutput || ""}
                                  onChange={(e) =>
                                    handleTestCaseChange(
                                      tcIndex,
                                      "expectedOutput",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                }}
              </form.Field>
            )}

            {/* QUIZ PAYLOAD */}
            {selectedType === LessonType.QUIZ && (
              <form.Field name="quizData">
                {(quizField) => {
                  const questions = quizField.state.value?.questions || [];

                  const handleAddQuestion = () => {
                    const nextOrder = questions.length + 1;
                    const updated = [
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
                      .filter((_, idx) => idx !== qIndex)
                      .map((q, idx) => ({ ...q, displayOrder: idx + 1 }));
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
                    const updatedOptions = [
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

                  const handleRemoveOption = (
                    qIndex: number,
                    oIndex: number,
                  ) => {
                    const question = questions[qIndex];
                    if (question.options.length <= 1) {
                      alert("A question must have at least one option.");
                      return;
                    }
                    const updatedOptions = question.options
                      .filter((_, idx) => idx !== oIndex)
                      .map((opt, idx) => ({ ...opt, displayOrder: idx + 1 }));

                    const hasCorrect = updatedOptions.some(
                      (opt) => opt.isCorrect,
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
                    const updatedOptions = question.options.map((opt, idx) => ({
                      ...opt,
                      isCorrect:
                        idx === oIndex ? !opt.isCorrect : opt.isCorrect,
                    }));
                    const updated = [...questions];
                    updated[qIndex] = { ...question, options: updatedOptions };
                    quizField.handleChange({ questions: updated });
                  };

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Quiz Questions ({questions.length})
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

                      {questions.map((q, qIndex) => {
                        const hasCorrectOption = q.options?.some(
                          (opt) => opt.isCorrect,
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
                                    <AlertCircle className="w-3 h-3" /> Select
                                    at least 1 correct option
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

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Options (Check the box for correct answer)
                                  </Label>
                                </div>

                                <div className="space-y-2">
                                  {q.options?.map((opt, oIndex) => (
                                    <div
                                      key={opt.id}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="flex items-center justify-center p-2 rounded border bg-muted/30">
                                        <Checkbox
                                          id={`opt-chk-${opt.id}`}
                                          checked={opt.isCorrect}
                                          onCheckedChange={() =>
                                            handleToggleCorrectOption(
                                              qIndex,
                                              oIndex,
                                            )
                                          }
                                        />
                                      </div>
                                      <Input
                                        placeholder={`Option ${oIndex + 1}...`}
                                        value={opt.optionText}
                                        onChange={(e) =>
                                          handleOptionTextChange(
                                            qIndex,
                                            oIndex,
                                            e.target.value,
                                          )
                                        }
                                        className={
                                          opt.isCorrect
                                            ? "border-emerald-500 bg-emerald-500/5 font-medium"
                                            : ""
                                        }
                                      />
                                      {q.options.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                                          onClick={() =>
                                            handleRemoveOption(qIndex, oIndex)
                                          }
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddOption(qIndex)}
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Add Option
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                }}
              </form.Field>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
