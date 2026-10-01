"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/auth.hook";
import type { IForgotPasswordPayload } from "@/types";
import { authValidation } from "@/validation/auth.validation";
import { AuthCard } from "./AuthCard";

export const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordPayload>({
    resolver: zodResolver(authValidation.ForgotPasswordZodSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: (res, variables) => {
      if (res?.success) {
        setApiError(null);
        setSuccessMsg(
          res.message || "A password reset code has been sent to your email.",
        );
        setTimeout(() => {
          const query = new URLSearchParams({
            email: variables.email,
          }).toString();
          router.push(`/reset-password?${query}`);
        }, 2000);
      } else {
        setApiError(
          res?.message || "Failed to process forgot password request.",
        );
      }
    },
    onError: (err) => {
      setApiError(err.message || "An error occurred. Please try again.");
    },
  });

  const onSubmit = (data: IForgotPasswordPayload) => {
    setApiError(null);
    setSuccessMsg(null);
    forgotPasswordMutation.mutate(data);
  };

  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email to receive a password reset verification code"
      footer={
        <p className="text-center text-sm">
          Remembered your password?{" "}
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
            autoComplete="email"
            disabled={forgotPasswordMutation.isPending}
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

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Code...
            </>
          ) : (
            "Send Reset Code"
          )}
        </Button>
      </form>
    </AuthCard>
  );
};
