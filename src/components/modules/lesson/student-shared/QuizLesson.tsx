"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  questions?: QuizQuestionDetails[];
}

interface QuizLessonProps {
  quizData?: QuizDataDetails | null;
}

export function QuizLesson({ quizData }: QuizLessonProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Quiz</h3>
        </div>
        <Badge variant="secondary">
          Total Questions: {quizData?.questions?.length ?? 0}
        </Badge>
      </div>

      {quizData?.questions && quizData.questions.length > 0 ? (
        <div className="space-y-6">
          {quizData.questions.map((q: QuizQuestionDetails, qIdx: number) => {
            const questionKey =
              q.id || `q-${q.displayOrder ?? qIdx + 1}-${q.questionText?.slice(0, 15) || qIdx}`;
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

                {/* Options rendered without revealing answers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                  {q.options?.map((opt: QuizOptionDetails, oIdx: number) => {
                    const optionKey =
                      opt.id || `opt-${opt.displayOrder ?? oIdx + 1}-${opt.optionText?.slice(0, 15) || oIdx}`;
                    return (
                      <div
                        key={optionKey}
                        className="flex items-center justify-between p-2.5 rounded-md border text-xs bg-muted/20 text-foreground transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        <span>{opt.optionText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-muted/40 rounded-lg text-center border text-sm text-muted-foreground">
          No questions available in this quiz.
        </div>
      )}
    </div>
  );
}