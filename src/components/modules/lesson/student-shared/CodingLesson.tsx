"use client";

import React from "react";
import { Code, Clock, HardDrive, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";

export interface CodingTestCaseDetails {
  id?: string;
  inputData?: string;
  expectedOutput?: string;
  isHidden?: boolean;
  displayOrder?: number;
}

export interface CodingDataDetails {
  problemStatement?: string;
  inputFormat?: string;
  outputFormat?: string;
  timeLimitMs?: number;
  memoryLimitKb?: number;
  testCases?: CodingTestCaseDetails[];
}

interface CodingLessonProps {
  codingData?: CodingDataDetails | null;
}

export function CodingLesson({ codingData }: CodingLessonProps) {
  // Filter out hidden test cases for students
  const publicTestCases = codingData?.testCases?.filter((tc) => !tc.isHidden) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Coding Challenge</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {codingData?.timeLimitMs ?? 1000} ms
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
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
            {codingData?.problemStatement || "No problem statement provided."}
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

      {/* Public Sample Test Cases Only */}
      {publicTestCases.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4" /> Sample Test Cases ({publicTestCases.length})
          </h4>
          <div className="space-y-3">
            {publicTestCases.map((tc: CodingTestCaseDetails, tcIdx: number) => {
              const testCaseKey =
                tc.id || `tc-${tc.displayOrder ?? tcIdx + 1}-${tc.inputData?.slice(0, 10) || tcIdx}`;
              return (
                <div
                  key={testCaseKey}
                  className="border rounded-lg p-3 bg-card space-y-2 text-xs font-mono"
                >
                  <div className="border-b pb-2">
                    <span className="font-semibold text-foreground">
                      Sample Case #{tc.displayOrder ?? tcIdx + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block mb-1">
                        Input:
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}