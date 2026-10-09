"use client";

import {
  Award,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { useVerifyCertificate } from "@/hooks/certificate.hook";

interface CertificateVerificationCardProps {
  initialUid?: string;
}

export function CertificateVerificationCard({
  initialUid = "",
}: CertificateVerificationCardProps) {
  const [searchUid, setSearchUid] = useState(initialUid);
  const [activeUid, setActiveUid] = useState(initialUid);

  const { data, isLoading, isError } = useVerifyCertificate(activeUid);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUid.trim()) {
      setActiveUid(searchUid.trim());
    }
  };

  const result = data?.data;

  const formattedDate = result?.issuedAt
    ? new Date(result.issuedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            Verify Certificate Authenticity
          </CardTitle>
          <CardDescription>
            Enter the unique Certificate ID (e.g., CBC-2026-A1B2C3D4) to verify
            its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="CBC-2026-XXXXXX"
                value={searchUid}
                onChange={(e) => setSearchUid(e.target.value)}
                className="pl-9 font-mono uppercase"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !searchUid.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="p-8 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-muted-foreground">
            Verifying certificate with secure registry...
          </p>
        </Card>
      )}

      {/* Verification Error / Not Found State */}
      {isError && activeUid && (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-red-900 dark:text-red-300">
              Invalid Certificate
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-400">
              No active certificate record was found for ID:{" "}
              <code className="font-mono font-bold">{activeUid}</code>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Verification Success Result */}
      {result?.isValid && (
        <Card className="border-emerald-200 bg-linear-to-b from-emerald-50/30 to-background dark:border-emerald-900/50 shadow-md">
          <CardHeader className="border-b bg-emerald-500/5 pb-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 px-3 py-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Authentic & Valid
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                UID: {result.certificateUid}
              </span>
            </div>
            <CardTitle className="text-2xl mt-3 text-slate-900 dark:text-slate-100">
              Official Certificate of Completion
            </CardTitle>
            <CardDescription>
              Issued by Code BD Code Interactive Programming Learning Platform
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Student Name
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.studentName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Course Completed
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {result.courseTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Issue Date
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t flex flex-wrap gap-3 justify-between">
            {result.certificateUrl ? (
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <a
                  href={result.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4" />
                  Download Verified PDF
                </a>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Digital credential verified in system database.
              </p>
            )}

            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <ExternalLink className="h-4 w-4" />
                Visit Code BD Code
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
