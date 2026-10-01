"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/auth.hook";
import type { IResetPasswordPayload } from "@/types";

import { authValidation } from "@/validation/auth.validation";
import { AuthCard } from "./AuthCard";
import { PasswordRequirements } from "./PasswordRequirements";

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IResetPasswordPayload>({
    resolver: zodResolver(authValidation.ResetPasswordZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const resetPasswordMutation = useResetPassword({
    onSuccess: (res) => {
      if (res?.success) {
        setApiError(null);
        setSuccessMsg(res.message || "Password changed successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setApiError(res?.message || "Failed to reset password.");
      }
    },
    onError: (err) => {
      setApiError(
        err.message || "Reset password failed. Check OTP and password.",
      );
    },
  });

  const onSubmit = (data: IResetPasswordPayload) => {
    setApiError(null);
    setSuccessMsg(null);
    resetPasswordMutation.mutate(data);
  };

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email, OTP, and new password to reset your account access"
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
            disabled={resetPasswordMutation.isPending}
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
            6-Digit OTP Code
          </label>
          <Input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            autoComplete="one-time-code"
            disabled={resetPasswordMutation.isPending}
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

        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={resetPasswordMutation.isPending}
              {...register("newPassword")}
              className={`pr-10 ${
                errors.newPassword
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <PasswordRequirements password={newPasswordValue} />

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </AuthCard>
  );
};
