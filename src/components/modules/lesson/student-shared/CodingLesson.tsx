"use client";

import React, { useState } from "react";
import {
  Code,
  Clock,
  HardDrive,
  Terminal,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Loader2,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  useRunCode,
  useSubmitCode,
  useGetMySubmissions,
} from "@/hooks/judge.hook";
import  {
  ProgrammingLanguage,
  SubmissionStatus,
  ICodeRunResult,
  ICodeSubmitResult,
  ApiResponse,
} from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface CodingTestCaseDetails {
  id?: string;
  inputData?: string;
  expectedOutput?: string;
  isHidden?: boolean;
  displayOrder?: number;
}

export interface CodingDataDetails {
  id: string; // codingLessonId
  lessonId?: string;
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

// Starter templates for popular languages
const DEFAULT_STARTER_CODE: Record<ProgrammingLanguage, string> = {
  [ProgrammingLanguage.JAVASCRIPT]: `// Read input from standard input\nconst fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\n\nfunction solve() {\n    // Write your code here\n    console.log(input);\n}\n\nsolve();`,
  [ProgrammingLanguage.TYPESCRIPT]: `import * as fs from 'fs';\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\n\nfunction solve() {\n    // Write your code here\n    console.log(input);\n}\n\nsolve();`,
  [ProgrammingLanguage.PYTHON]: `# Read input from standard input\nimport sys\n\ndef solve():\n    input_data = sys.stdin.read().strip()\n    # Write your code here\n    print(input_data)\n\nif __name__ == "__main__":\n    solve()`,
  [ProgrammingLanguage.JAVA]: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextLine()) {\n            String input = scanner.nextLine();\n            System.out.println(input);\n        }\n    }\n}`,
  [ProgrammingLanguage.CPP]: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string input;\n    if (getline(cin, input)) {\n        cout << input << endl;\n    }\n    return 0;\n}`,
  [ProgrammingLanguage.C]: `#include <stdio.h>\n\nint main() {\n    char buffer[1024];\n    if (fgets(buffer, sizeof(buffer), stdin)) {\n        printf("%s", buffer);\n    }\n    return 0;\n}`,
  [ProgrammingLanguage.GO]: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tif scanner.Scan() {\n\t\tfmt.Println(scanner.Text())\n\t}\n}`,
  [ProgrammingLanguage.RUST]: `use std::io::{self, Read};\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_to_string(&mut input).unwrap();\n    println!("{}", input.trim());\n}`,
  [ProgrammingLanguage.PHP]: `<?php\n$input = file_get_contents('php://stdin');\necho trim($input);`,
  [ProgrammingLanguage.CSHARP]: `using System;\n\nclass Program {\n    static void Main() {\n        string input = Console.ReadLine();\n        Console.WriteLine(input);\n    }\n}`,
};

export function CodingLesson({ codingData }: CodingLessonProps) {
  const codingLessonId = codingData?.id || "";

  // Form & Selection state
  const [language, setLanguage] = useState<ProgrammingLanguage>(
    ProgrammingLanguage.JAVASCRIPT,
  );
  const [sourceCode, setSourceCode] = useState<string>(
    DEFAULT_STARTER_CODE[ProgrammingLanguage.JAVASCRIPT],
  );

  // Results state
  const [activeBottomTab, setActiveBottomTab] = useState<string>("testcases");
  const [runResult, setRunResult] = useState<ICodeRunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<ICodeSubmitResult | null>(
    null,
  );

  // Mutations & Queries
  const runMutation = useRunCode();
  const submitMutation = useSubmitCode();
  const { data: mySubmissionsRes, isLoading: isLoadingSubmissions } =
    useGetMySubmissions(codingLessonId, {
      enabled: !!codingLessonId,
    });

  const submissions = (mySubmissionsRes?.data as any[]) || [];
  const publicTestCases =
    codingData?.testCases?.filter((tc) => !tc.isHidden) || [];

  // Handle language change
  const handleLanguageChange = (val: ProgrammingLanguage) => {
    setLanguage(val);
    setSourceCode(DEFAULT_STARTER_CODE[val] || "");
  };

  // Handle Run Code
  const handleRunCode = () => {
    if (!codingLessonId || !sourceCode.trim()) return;

    setSubmitResult(null);
    setActiveBottomTab("results");

    runMutation.mutate(
      { codingLessonId, language, sourceCode },
      {
        onSuccess: (res: ApiResponse) => {
          setRunResult(res.data as ICodeRunResult);
        },
      },
    );
  };

  // Handle Submit Code
  const handleSubmitCode = () => {
    if (!codingLessonId || !sourceCode.trim()) return;

    setRunResult(null);
    setActiveBottomTab("results");

    submitMutation.mutate(
      { codingLessonId, language, sourceCode },
      {
        onSuccess: (res: ApiResponse) => {
          setSubmitResult(res.data as ICodeSubmitResult);
        },
      },
    );
  };

  // Helper for Status Badges
  const renderStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case SubmissionStatus.ACCEPTED:
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </Badge>
        );
      case SubmissionStatus.WRONG_ANSWER:
        return (
          <Badge variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white gap-1 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Wrong Answer
          </Badge>
        );
      case SubmissionStatus.TIME_LIMIT_EXCEEDED:
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> Time Limit Exceeded
          </Badge>
        );
      case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
        return (
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white gap-1 font-medium">
            <HardDrive className="w-3.5 h-3.5" /> Memory Limit Exceeded
          </Badge>
        );
      case SubmissionStatus.COMPILATION_ERROR:
        return (
          <Badge variant="outline" className="border-rose-500/50 text-rose-400 bg-rose-950/30 gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> Compilation Error
          </Badge>
        );
      case SubmissionStatus.RUNTIME_ERROR:
        return (
          <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-950/30 gap-1 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> Runtime Error
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">{status}</Badge>;
    }
  };

  return (
    <div className="w-full text-zinc-100 dark bg-black min-h-screen p-2 sm:p-4 lg:p-6 font-sans">
      {/* 2-Column Responsive Layout: Mobile=1 col, Desktop=2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start max-w-[1700px] mx-auto">
        
        {/* LEFT COLUMN: Problem Statement & Details */}
        <div className="lg:col-span-5 flex flex-col gap-4 border border-zinc-800/80 bg-zinc-950 p-4 sm:p-5 rounded-xl shadow-2xl">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">
                Coding Challenge
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center gap-1.5 text-xs py-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {codingData?.timeLimitMs ?? 1000} ms
              </Badge>
              <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-300 flex items-center gap-1.5 text-xs py-1">
                <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                {codingData?.memoryLimitKb ?? 256000} KB
              </Badge>
            </div>
          </div>

          {/* Problem Statement Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-zinc-500" />
              <span>Problem Statement</span>
            </div>
            <div className="p-4 bg-zinc-900/60 text-zinc-200 rounded-lg text-sm leading-relaxed border border-zinc-800/80 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {codingData?.problemStatement || "No problem statement provided."}
              </ReactMarkdown>
            </div>
          </div>

          {/* Input & Output Formats */}
          {(codingData?.inputFormat || codingData?.outputFormat) && (
            <div className="space-y-4 pt-1">
              {codingData?.inputFormat && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Input Format
                  </h4>
                  <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/80 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {codingData.inputFormat}
                  </div>
                </div>
              )}
              {codingData?.outputFormat && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Output Format
                  </h4>
                  <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/80 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {codingData.outputFormat}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Test Cases (Side display on left column for easy reference) */}
          {publicTestCases.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Sample Test Cases
              </h4>
              <div className="space-y-3">
                {publicTestCases.map((tc: CodingTestCaseDetails, tcIdx: number) => (
                  <div
                    key={tc.id || `tc-${tcIdx}`}
                    className="border border-zinc-800/80 rounded-lg p-3 bg-zinc-900/40 space-y-2 text-xs font-mono"
                  >
                    <div className="text-zinc-400 font-semibold border-b border-zinc-800/60 pb-1.5 text-[11px]">
                      Sample Case #{tc.displayOrder ?? tcIdx + 1}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-sans">
                          Input:
                        </span>
                        <pre className="p-2 bg-zinc-950 rounded border border-zinc-800/80 overflow-x-auto text-zinc-200">
                          {tc.inputData || "(empty)"}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-sans">
                          Expected Output:
                        </span>
                        <pre className="p-2 bg-zinc-950 rounded border border-zinc-800/80 overflow-x-auto text-zinc-200">
                          {tc.expectedOutput || "(empty)"}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor & Execution Results */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Interactive Code Editor Section */}
          <div className="border border-zinc-800/80 rounded-xl bg-zinc-950 overflow-hidden shadow-2xl flex flex-col">
            {/* Editor Top Bar Controls */}
            <div className="flex flex-wrap items-center justify-between p-3 bg-zinc-900/90 border-b border-zinc-800 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Language:
                </span>
                <Select
                  value={language}
                  onValueChange={(val) => handleLanguageChange(val as ProgrammingLanguage)}
                >
                  <SelectTrigger className="w-[150px] h-8 bg-zinc-950 border-zinc-800 text-xs text-zinc-200 focus:ring-1 focus:ring-zinc-700">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                    {Object.values(ProgrammingLanguage).map((lang) => (
                      <SelectItem key={lang} value={lang} className="text-xs hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
                  onClick={handleRunCode}
                  disabled={runMutation.isPending || submitMutation.isPending}
                >
                  {runMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current text-zinc-300" />
                  )}
                  Run Code
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 font-medium transition-colors shadow-sm"
                  onClick={handleSubmitCode}
                  disabled={runMutation.isPending || submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Submit Solution
                </Button>
              </div>
            </div>

            {/* Textarea Code Input */}
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Write your code here..."
              className="w-full h-80 sm:h-[400px] p-4 bg-zinc-950 text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none resize-y border-none selection:bg-zinc-800"
              spellCheck={false}
            />
          </div>

          {/* Bottom Tabs: Testcases, Execution Output & My Submissions */}
          <div className="border border-zinc-800/80 rounded-xl bg-zinc-950 p-3 sm:p-4 shadow-xl">
            <Tabs value={activeBottomTab} onValueChange={setActiveBottomTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-900 border border-zinc-800/80 p-1">
                <TabsTrigger value="testcases" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                  <Terminal className="w-3.5 h-3.5" /> 
                  <span className="hidden sm:inline">Sample Cases</span>
                  <span className="sm:hidden">Cases</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                  <Code className="w-3.5 h-3.5" /> 
                  <span className="hidden sm:inline">Output & Execution</span>
                  <span className="sm:hidden">Output</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="text-xs flex items-center gap-1.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100">
                  <History className="w-3.5 h-3.5" /> 
                  <span className="hidden sm:inline">Submissions ({submissions.length})</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Sample Test Cases */}
              <TabsContent value="testcases" className="space-y-3 pt-3">
                {publicTestCases.length > 0 ? (
                  <div className="space-y-3">
                    {publicTestCases.map((tc: CodingTestCaseDetails, tcIdx: number) => (
                      <div
                        key={tc.id || `tc-${tcIdx}`}
                        className="border border-zinc-800/80 rounded-lg p-3 bg-zinc-900/40 space-y-2 text-xs font-mono"
                      >
                        <div className="border-b border-zinc-800/60 pb-1.5 font-semibold text-zinc-300">
                          Sample Case #{tc.displayOrder ?? tcIdx + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-sans">
                              Input:
                            </span>
                            <pre className="p-2 bg-zinc-950 rounded border border-zinc-800/80 overflow-x-auto text-zinc-200">
                              {tc.inputData || "(empty)"}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-sans">
                              Expected Output:
                            </span>
                            <pre className="p-2 bg-zinc-950 rounded border border-zinc-800/80 overflow-x-auto text-zinc-200">
                              {tc.expectedOutput || "(empty)"}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 p-6 text-center border border-zinc-800/60 rounded-lg">
                    No sample test cases available.
                  </p>
                )}
              </TabsContent>

              {/* Tab 2: Execution Results */}
              <TabsContent value="results" className="space-y-4 pt-3">
                {(runMutation.isPending || submitMutation.isPending) && (
                  <div className="p-8 border border-zinc-800 rounded-lg flex items-center justify-center gap-3 text-zinc-400 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                    Executing code against judge runner...
                  </div>
                )}

                {/* Run Code Results */}
                {!runMutation.isPending && runResult && (
                  <div className="border border-zinc-800/80 rounded-lg p-4 space-y-4 bg-zinc-900/30">
                    <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-zinc-400">
                          Run Result:
                        </span>
                        {renderStatusBadge(runResult.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span>Passed: {runResult.passedTestCasesCount} / {runResult.totalTestCases}</span>
                        <span>Time: {runResult.runtimeMs} ms</span>
                        <span>Memory: {runResult.memoryUsedKb} KB</span>
                      </div>
                    </div>

                    {/* Individual Test Cases Detail */}
                    <div className="space-y-3">
                      {runResult.testCases?.map((tc, idx) => (
                        <div
                          key={tc.testCaseId || idx}
                          className={`border rounded-md p-3 text-xs font-mono space-y-2 ${
                            tc.passed
                              ? "bg-emerald-950/20 border-emerald-800/50"
                              : "bg-rose-950/20 border-rose-800/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-300">Test Case #{idx + 1}</span>
                            {tc.passed ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                              </span>
                            ) : (
                              <span className="text-rose-400 font-semibold flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase block font-sans">Expected Output:</span>
                              <pre className="p-1.5 bg-zinc-950 rounded border border-zinc-800 mt-0.5 text-zinc-200">{tc.expectedOutput || "(empty)"}</pre>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-500 uppercase block font-sans">Your Output:</span>
                              <pre className="p-1.5 bg-zinc-950 rounded border border-zinc-800 mt-0.5 text-zinc-200">{tc.actualOutput || "(empty)"}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Code Results */}
                {!submitMutation.isPending && submitResult && (
                  <div className="border border-zinc-800/80 rounded-lg p-4 space-y-3 bg-zinc-900/30">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-zinc-400">
                          Submission Verdict:
                        </span>
                        {renderStatusBadge(submitResult.status)}
                      </div>
                      <span className="text-xs text-zinc-500">
                        {new Date(submitResult.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="p-3 bg-zinc-950 rounded-md border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
                      <div>Passed Test Cases: {submitResult.passedTestCasesCount} / {submitResult.totalTestCases}</div>
                      <div>Runtime: {submitResult.runtimeMs} ms</div>
                      <div>Memory Used: {submitResult.memoryUsedKb} KB</div>
                    </div>
                  </div>
                )}

                {!runMutation.isPending && !submitMutation.isPending && !runResult && !submitResult && (
                  <p className="text-xs text-zinc-500 p-6 text-center border border-zinc-800/60 rounded-lg">
                    Click &quot;Run Code&quot; to test against public test cases or &quot;Submit Solution&quot; for full evaluation.
                  </p>
                )}
              </TabsContent>

              {/* Tab 3: My Submissions History */}
              <TabsContent value="history" className="pt-3">
                {isLoadingSubmissions ? (
                  <div className="p-6 border border-zinc-800 rounded-lg text-center text-xs text-zinc-500">
                    Loading submissions...
                  </div>
                ) : submissions.length > 0 ? (
                  <div className="space-y-2">
                    {submissions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 border border-zinc-800/80 rounded-lg text-xs bg-zinc-900/40 hover:bg-zinc-900 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {renderStatusBadge(sub.status)}
                            <span className="font-mono text-[11px] font-semibold text-zinc-400">
                              {sub.language}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Passed: {sub.passedTestCasesCount} test cases
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-zinc-500 space-y-1">
                          <div>{new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString()}</div>
                          <div className="font-mono text-zinc-400">{sub.runtimeMs ?? 0} ms | {sub.memoryUsedKb ?? 0} KB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 p-6 text-center border border-zinc-800/60 rounded-lg">
                    No submissions found for this coding lesson.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

      </div>
    </div>
  );
}