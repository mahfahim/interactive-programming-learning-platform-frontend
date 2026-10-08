"use client";

import React from "react";
import { FileCheck, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";

export interface AssignmentDataDetails {
  title?: string;
  instructions?: string;
  dueDate?: string | Date;
}

interface AssignmentLessonProps {
  assignmentData?: AssignmentDataDetails | null;
  fallbackTitle: string;
}

export function AssignmentLesson({ assignmentData, fallbackTitle }: AssignmentLessonProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">
            {assignmentData?.title || fallbackTitle}
          </h3>
        </div>
        {assignmentData?.dueDate && (
          <Badge variant="outline" className="flex items-center gap-1.5 w-fit text-xs">
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
            {assignmentData?.instructions || "No instructions provided."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}