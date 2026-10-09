"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Loader2,
  Paperclip,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
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
import {
  useAssignmentByLessonId,
  useMySubmission,
  useSubmitAssignment,
} from "@/hooks/assignment.hook";

export interface AssignmentDataDetails {
  id?: string;
  title?: string;
  instructions?: string;
  dueDate?: string | Date;
  lessonId?: string;
}

interface AssignmentSubmissionItem {
  id: string;
  assignmentId: string;
  userId: string;
  fileUrls: string[];
  scoreObtained?: number | null;
  instructorFeedback?: string | null;
  gradedAt?: string | null;
  submittedAt: string;
}

interface AssignmentLessonProps {
  lessonId: string;
  assignmentData?: AssignmentDataDetails | null;
  fallbackTitle: string;
}

export function AssignmentLesson({
  lessonId,
  assignmentData,
  fallbackTitle,
}: AssignmentLessonProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 1. Fetch assignment details by lesson ID if ID isn't directly on assignmentData
  const { data: fetchedAssignmentRes, isLoading: isAssignmentLoading } =
    useAssignmentByLessonId(lessonId, {
      enabled: !assignmentData?.id && !!lessonId,
    });

  const assignment = assignmentData?.id
    ? assignmentData
    : (fetchedAssignmentRes?.data as AssignmentDataDetails) || assignmentData;

  const assignmentId = assignment?.id || "";

  // 2. Fetch student's existing submission for this assignment
  const { data: mySubmissionsRes, isLoading: isSubmissionsLoading } =
    useMySubmission(assignmentId, {
      enabled: !!assignmentId,
    });

  // Extract latest submission
  const submissionsData = mySubmissionsRes?.data;
  const latestSubmission: AssignmentSubmissionItem | null = Array.isArray(
    submissionsData,
  )
    ? submissionsData[0] || null
    : (submissionsData as unknown as AssignmentSubmissionItem) || null;

  // 3. Submit Assignment Mutation
  const submitAssignmentMutation = useSubmitAssignment({
    onSuccess: () => {
      setSelectedFiles([]);
      setSubmitSuccess(true);
      setSubmitError(null);
    },
    onError: (err: Error) => {
      setSubmitError(
        err.message || "Failed to submit assignment. Please try again.",
      );
      setSubmitSuccess(false);
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (selectedFiles.length + filesArray.length > 5) {
        setSubmitError("You can upload a maximum of 5 files.");
        return;
      }
      setSubmitError(null);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId) {
      setSubmitError("Assignment ID not found.");
      return;
    }

    if (selectedFiles.length === 0) {
      setSubmitError("Please select at least one file to upload.");
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(false);
    submitAssignmentMutation.mutate({
      assignmentId,
      files: selectedFiles,
    });
  };

  const isGraded =
    latestSubmission?.scoreObtained !== undefined &&
    latestSubmission?.scoreObtained !== null;
  const dueDatePassed = assignment?.dueDate
    ? new Date(assignment.dueDate) < new Date()
    : false;

  return (
    <div className="space-y-8">
      {/* Assignment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold">
              {assignment?.title || fallbackTitle}
            </h3>
          </div>
          {assignment?.dueDate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Due Date: {new Date(assignment.dueDate).toLocaleString()}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isGraded ? (
            <Badge
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3 py-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Graded
            </Badge>
          ) : latestSubmission ? (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 gap-1 px-3 py-1"
            >
              <Clock className="w-3.5 h-3.5" /> Submitted (Pending Review)
            </Badge>
          ) : dueDatePassed ? (
            <Badge variant="destructive" className="gap-1 px-3 py-1">
              <AlertCircle className="w-3.5 h-3.5" /> Overdue
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 px-3 py-1">
              <Clock className="w-3.5 h-3.5" /> Pending Submission
            </Badge>
          )}
        </div>
      </div>

      {/* Instructions & Requirements */}
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
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 text-sm text-foreground mb-3">
                  {children}
                </ol>
              ),
            }}
          >
            {assignment?.instructions || "No instructions provided."}
          </ReactMarkdown>
        </div>
      </div>

      {/* Loading state for submission queries */}
      {isSubmissionsLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Checking previous submission history...
        </div>
      )}

      {/* Graded Feedback Card */}
      {latestSubmission && isGraded && (
        <Card className="border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Grading Results
              </span>
              <span className="text-xl font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-md border border-emerald-300 dark:border-emerald-700">
                Score: {latestSubmission.scoreObtained}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {latestSubmission.instructorFeedback && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Instructor Feedback:
                </p>
                <p className="text-foreground mt-1 p-3 bg-background/80 rounded border">
                  {latestSubmission.instructorFeedback}
                </p>
              </div>
            )}
            {latestSubmission.gradedAt && (
              <p className="text-xs text-muted-foreground">
                Graded on {new Date(latestSubmission.gradedAt).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Submission Details */}
      {latestSubmission && (
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Your Latest Submission
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                Submitted{" "}
                {new Date(latestSubmission.submittedAt).toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Uploaded Files:
            </p>
            {latestSubmission.fileUrls &&
            latestSubmission.fileUrls.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {latestSubmission.fileUrls.map((url, fileIndex) => (
                  <a
                    key={url || `attachment-${fileIndex}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-md border bg-background hover:bg-accent text-xs transition-colors group"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate flex-1 font-medium">
                      Attachment #{fileIndex + 1}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No file attachments found.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Form Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            {latestSubmission ? "Resubmit Assignment" : "Submit Assignment"}
          </CardTitle>
          <CardDescription className="text-xs">
            Upload up to 5 files (PDF, ZIP, DOCX, Images) to submit your work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* File Dropzone Input */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-muted/10 cursor-pointer relative">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={submitAssignmentMutation.isPending}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="assignment-file-input"
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">
                  Click or drag files here to attach
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum 5 files allowed
                </p>
              </div>
            </div>

            {/* Selected Files Preview List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Selected Files ({selectedFiles.length}/5)
                </p>
                <div className="space-y-1.5">
                  {selectedFiles.map((file) => {
                    const fileKey = `${file.name}-${file.lastModified}-${file.size}`;
                    return (
                      <div
                        key={fileKey}
                        className="flex items-center justify-between p-2 rounded-md border bg-background text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate font-medium">
                            {file.name}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFile(file)}
                          disabled={submitAssignmentMutation.isPending}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Messages */}
            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Assignment submitted successfully!</span>
              </div>
            )}

            {/* Submit Action Button */}
            <Button
              type="submit"
              disabled={
                selectedFiles.length === 0 || submitAssignmentMutation.isPending
              }
              className="w-full sm:w-auto"
            >
              {submitAssignmentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading & Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {latestSubmission ? "Submit Revision" : "Submit Assignment"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
