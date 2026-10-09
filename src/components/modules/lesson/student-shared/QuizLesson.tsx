"use client";

import {
  AlertCircle,
  Award,
  CheckCircle2,
  HelpCircle,
  History,
  Loader2,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAttemptById,
  useGetMyAttempts,
  useGetQuizByLessonId,
  useSubmitQuiz,
} from "@/hooks/quiz.hook";

export interface QuizOptionDetails {
  id?: string;
  optionText?: string;
  displayOrder?: number;
}

export interface QuizQuestionDetails {
  id?: string;
  questionText?: string;
  displayOrder?: number;
  options?: QuizOptionDetails[];
}

export interface QuizDataDetails {
  id?: string;
  lessonId?: string;
  questions?: QuizQuestionDetails[];
}

interface QuizLessonProps {
  lessonId: string;
  quizData?: QuizDataDetails | null;
}

export function QuizLesson({
  lessonId,
  quizData: initialQuizData,
}: QuizLessonProps) {
  // State management
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // API Hooks
  const { data: quizResponse, isLoading: isQuizLoading } =
    useGetQuizByLessonId(lessonId);
  const submitQuizMutation = useSubmitQuiz();

  const quiz = (quizResponse?.data as QuizDataDetails) || initialQuizData;
  const quizLessonId = quiz?.id || "";

  // Attempt History Hook
  const { data: attemptsResponse, isLoading: isAttemptsLoading } =
    useGetMyAttempts(quizLessonId, { enabled: !!quizLessonId });
  const myAttempts =
    (attemptsResponse?.data as Array<{
      id: string;
      score: number;
      attemptedAt: string;
      _count: { answers: number };
    }>) || [];

  // Active Attempt Detail Hook
  const { data: attemptDetailResponse, isLoading: isAttemptDetailLoading } =
    useGetAttemptById(activeAttemptId || "", { enabled: !!activeAttemptId });

  const activeAttempt = attemptDetailResponse?.data as {
    id: string;
    score: number;
    attemptedAt: string;
    answers: Array<{
      questionId: string;
      questionText: string;
      selectedOptionId: string;
      selectedOptionText: string;
      isCorrect: boolean;
      correctOptionId?: string;
      correctOptionText?: string;
    }>;
  } | null;

  // Handlers
  const handleOptionSelect = (questionId: string, optionId: string) => {
    setValidationError(null);
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    questionId: string,
    optionId: string,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOptionSelect(questionId, optionId);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (q) => q.id && !selectedAnswers[q.id],
    );
    if (unansweredQuestions.length > 0) {
      setValidationError(
        `Please answer all questions before submitting (${unansweredQuestions.length} remaining).`,
      );
      return;
    }

    const payload = {
      quizLessonId: quiz.id!,
      answers: Object.entries(selectedAnswers).map(
        ([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }),
      ),
    };

    try {
      const response = await submitQuizMutation.mutateAsync(payload);
      const resData = response?.data as { attemptId: string };
      if (resData?.attemptId) {
        setActiveAttemptId(resData.attemptId);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit quiz";
      setValidationError(errorMsg);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setActiveAttemptId(null);
    setValidationError(null);
  };

  // Render loading state
  if (isQuizLoading && !quiz) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="p-6 bg-muted/40 rounded-lg text-center border text-sm text-muted-foreground">
        No questions available in this quiz.
      </div>
    );
  }

  const questionsCount = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Lesson Quiz</h3>
        </div>

        <div className="flex items-center gap-2">
          {myAttempts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs"
            >
              <History className="w-3.5 h-3.5 mr-1" />
              {showHistory ? "Hide History" : `Attempts (${myAttempts.length})`}
            </Button>
          )}

          <Badge variant="secondary">Total Questions: {questionsCount}</Badge>
        </div>
      </div>

      {/* Attempt History Section */}
      {showHistory && (
        <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            Previous Attempts
          </h4>

          {isAttemptsLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <div className="divide-y border rounded-md bg-background">
              {myAttempts.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="p-3 flex items-center justify-between text-xs hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-medium">
                      Attempt #{myAttempts.length - index}
                    </span>
                    <p className="text-muted-foreground text-[11px]">
                      {new Date(attempt.attemptedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      Score: {attempt.score}/{questionsCount}
                    </Badge>
                    <Button
                      size="sm"
                      variant={
                        activeAttemptId === attempt.id ? "default" : "ghost"
                      }
                      onClick={() => {
                        setActiveAttemptId(attempt.id);
                        setShowHistory(false);
                      }}
                      className="h-7 text-xs"
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RESULT VIEW: Active Attempt Summary */}
      {activeAttemptId ? (
        <div className="space-y-6">
          {isAttemptDetailLoading || !activeAttempt ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              {/* Score Banner */}
              <div className="p-5 border rounded-lg bg-emerald-500/10 border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base">Quiz Completed!</h4>
                    <p className="text-xs text-muted-foreground">
                      Submitted on{" "}
                      {new Date(activeAttempt.attemptedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-600">
                      {activeAttempt.score}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / {questionsCount}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      (
                      {Math.round((activeAttempt.score / questionsCount) * 100)}
                      % score)
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleRetakeQuiz}
                    className="gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake
                  </Button>
                </div>
              </div>

              {/* Detailed Answers Review */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Detailed Answer Review
                </h4>

                {quiz.questions.map((q, qIdx) => {
                  const submittedAns = activeAttempt.answers.find(
                    (a) => a.questionId === q.id,
                  );
                  const isCorrect = submittedAns?.isCorrect;

                  return (
                    <div
                      key={q.id || qIdx}
                      className={`border rounded-lg p-4 space-y-3 ${
                        isCorrect
                          ? "border-emerald-200 bg-emerald-50/20"
                          : "border-rose-200 bg-rose-50/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            Q{q.displayOrder ?? qIdx + 1}
                          </span>
                          <h4 className="font-medium text-sm text-foreground pt-0.5">
                            {q.questionText}
                          </h4>
                        </div>
                        {isCorrect ? (
                          <Badge className="bg-emerald-600 gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="gap-1 text-[11px]"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </Badge>
                        )}
                      </div>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 gap-2 pl-7 pt-1">
                        {q.options?.map((opt) => {
                          const isSelected =
                            submittedAns?.selectedOptionId === opt.id;
                          const isCorrectOption =
                            submittedAns?.correctOptionId === opt.id;

                          let optionStyle =
                            "border-muted bg-background text-muted-foreground";
                          if (isCorrectOption) {
                            optionStyle =
                              "border-emerald-500 bg-emerald-500/10 text-emerald-900 font-medium";
                          } else if (isSelected && !isCorrect) {
                            optionStyle =
                              "border-rose-500 bg-rose-500/10 text-rose-900 font-medium";
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`flex items-center justify-between p-2.5 rounded-md border text-xs transition-colors ${optionStyle}`}
                            >
                              <span>{opt.optionText}</span>
                              {isCorrectOption && (
                                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Correct
                                  Answer
                                </span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                                  <XCircle className="w-3 h-3" /> Your Answer
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        /* QUIZ TAKING VIEW */
        <div className="space-y-6">
          {validationError && (
            <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="space-y-6">
            {quiz.questions.map((q: QuizQuestionDetails, qIdx: number) => {
              const questionId = q.id || `q-${qIdx}`;
              const selectedOptionId = selectedAnswers[questionId];

              return (
                <div
                  key={questionId}
                  className="border rounded-lg p-4 bg-card space-y-3 shadow-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      Q{q.displayOrder ?? qIdx + 1}
                    </span>
                    <h4 className="font-medium text-sm md:text-base pt-0.5 text-foreground">
                      {q.questionText}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                    {q.options?.map((opt: QuizOptionDetails, oIdx: number) => {
                      const optionId = opt.id || `opt-${oIdx}`;
                      const isSelected = selectedOptionId === optionId;

                      return (
                        <button
                          type="button"
                          key={optionId}
                          onClick={() =>
                            handleOptionSelect(questionId, optionId)
                          }
                          onKeyDown={(e) =>
                            handleOptionKeyDown(e, questionId, optionId)
                          }
                          className={`flex items-center justify-between w-full text-left p-3 rounded-md border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-50/50 font-medium text-emerald-900 ring-1 ring-emerald-600"
                              : "border-border bg-muted/20 text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <span>{opt.optionText}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-muted-foreground/40"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-xs text-muted-foreground">
              {answeredCount} of {questionsCount} questions answered
            </span>

            <Button
              onClick={handleSubmit}
              disabled={submitQuizMutation.isPending || answeredCount === 0}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitQuizMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
