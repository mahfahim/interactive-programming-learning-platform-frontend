"use client";

import {
  Award,
  Calendar,
  Check,
  Download,
  ExternalLink,
  FileText,
  Lock,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyCertificate } from "@/hooks/certificate.hook";

interface CourseCertificateCardProps {
  courseId: string;
}

export function CourseCertificateCard({
  courseId,
}: CourseCertificateCardProps) {
  const { data, isLoading, isError, error, refetch } =
    useGetMyCertificate(courseId);
  const [copied, setCopied] = useState(false);

  const certificate = data?.data;

  const handleCopyVerificationLink = () => {
    if (!certificate?.certificateUid) return;
    const verifyUrl = `${window.location.origin}/verify/${certificate.certificateUid}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <CertificateSkeleton />;
  }

  if (isError || !certificate) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ||
      "Certificate not available yet. Please complete all course lessons first.";

    return (
      <Card className="border-dashed border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Certificate Locked</CardTitle>
          <CardDescription className="max-w-md mx-auto text-muted-foreground">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={() => refetch()} size="sm">
            Check Completion Status
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <Card className="relative overflow-hidden border-indigo-100 dark:border-indigo-950 bg-linear-to-br from-white via-indigo-50/30 to-amber-50/20 dark:from-slate-950 dark:via-indigo-950/10 dark:to-amber-950/10 shadow-md">
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl" />

      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
            >
              <ShieldCheck className="mr-1 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Verified Certificate
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Course Certificate
          </CardTitle>
          <CardDescription>
            Official Certificate of Completion for{" "}
            {certificate.courseTitle || "this course"}
          </CardDescription>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
          <Award className="h-6 w-6" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <div className="grid gap-3 rounded-lg border bg-background/80 p-4 text-sm backdrop-blur-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 text-indigo-500" />
            <span>Issued To:</span>
            <strong className="text-foreground">
              {certificate.studentName || "Student"}
            </strong>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>Issued Date:</span>
            <strong className="text-foreground">{formattedDate}</strong>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground sm:col-span-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span>Certificate ID:</span>
            <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
              {certificate.certificateUid}
            </code>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 pt-2">
        {certificate.certificateUrl && (
          <Button
            asChild
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Preview Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[85vh] p-4 flex flex-col">
            <DialogHeader className="pb-2">
              <DialogTitle>Certificate Preview</DialogTitle>
              <DialogDescription>
                Certificate UID: {certificate.certificateUid}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 w-full h-full min-h-125 overflow-hidden rounded-md border bg-slate-100 dark:bg-slate-900">
              {certificate.certificateUrl ? (
                <iframe
                  src={`${certificate.certificateUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title="Certificate PDF Preview"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <Award className="h-16 w-16 text-indigo-500 mb-2 animate-bounce" />
                  <p className="text-lg font-medium">Certificate Generated</p>
                  <p className="text-sm text-muted-foreground">
                    PDF URL is being synced. Refresh in a few seconds to view.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyVerificationLink}
          title="Copy public verification link"
          className="ml-auto"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function CertificateSkeleton() {
  return (
    <Card className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
      </div>
    </Card>
  );
}
