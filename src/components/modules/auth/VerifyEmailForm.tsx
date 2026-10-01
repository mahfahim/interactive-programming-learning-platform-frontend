"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyPatientEmail } from "@/hooks/auth.hook";
import type { IVerifyEmailPayload } from "@/types";
import { authValidation } from "@/validation/auth.validation";
import { AuthCard } from "./AuthCard";

export const VerifyEmailForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IVerifyEmailPayload>({
    resolver: zodResolver(authValidation.UserEmailVerifyZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const verifyMutation = useVerifyPatientEmail({
    onSuccess: (res) => {
      if (res?.success) {
        setApiError(null);
        setSuccessMsg(res.message || "Email verified successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setApiError(res?.message || "Verification failed. Invalid OTP.");
      }
    },
    onError: (err) => {
      setApiError(err.message || "Verification failed. OTP may have expired.");
    },
  });

  const onSubmit = (data: IVerifyEmailPayload) => {
    setApiError(null);
    setSuccessMsg(null);
    verifyMutation.mutate(data);
  };

  return (
    <AuthCard
      title="Verify Your Email"
      description="Enter the 6-digit verification code sent to your inbox"
      footer={
        <p className="text-center text-sm">
          Remembered your credentials?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </p>
      }
    >
      {apiError && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{apiError}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            disabled={verifyMutation.isPending}
            {...register("email")}
            className={
              errors.email
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="otp"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            6-Digit Verification Code
          </label>
          <Input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            autoComplete="one-time-code"
            disabled={verifyMutation.isPending}
            {...register("otp")}
            className={`tracking-widest text-center text-lg font-mono font-bold ${
              errors.otp
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }`}
          />
          {errors.otp && (
            <p className="text-xs text-destructive">
              {errors.otp.message || "OTP must be exactly 6 digits."}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>
    </AuthCard>
  );
};
