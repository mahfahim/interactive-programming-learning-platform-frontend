"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginUser } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store";
import type { ILoginUserPayload } from "@/types";
import { decodeJwt } from "@/utils/jwt.util";
import { authValidation } from "@/validation/auth.validation";
import { AuthCard } from "./AuthCard";
import { GoogleLoginButton } from "./GoogleLoginButton";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ILoginUserPayload>({
    resolver: zodResolver(authValidation.LoginZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLoginUser({
    onSuccess: (res) => {
      const authData = res?.data as
        | { accessToken?: string; refreshToken?: string }
        | undefined;

      if (res?.success && authData?.accessToken) {
        setApiError(null);

        try {
          const decodedToken = decodeJwt(authData.accessToken);
          setAuth(decodedToken, authData.accessToken);

          setTimeout(() => {
            const userRole = decodedToken?.role || decodedToken?.userRole;

            switch (userRole) {
              case "ADMIN":
              case "SUPER_ADMIN":
                router.push("/admin/analytics");
                break;
              case "INSTRUCTOR":
              case "TEACHER":
                router.push("/instructor");
                break;
              case "STUDENT":
              default:
                router.push("/student");
                break;
            }
          }, 0);
        } catch {
          setApiError("Invalid authentication token received.");
        }
      } else {
        setApiError(
          res?.message || "Login failed. Please check your credentials.",
        );
      }
    },
    onError: (err) => {
      setApiError(err.message || "An unexpected error occurred during login.");
    },
  });

  const onSubmit = (data: ILoginUserPayload) => {
    setApiError(null);
    loginMutation.mutate(data);
  };

  // Quick Demo Login Handler
  const handleDemoLogin = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    setApiError(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Enter your credentials to access your account"
      footer={
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
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
            disabled={loginMutation.isPending}
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              {...register("password")}
              className={`pr-10 ${errors.password
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
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      {/* Quick Demo Login Section */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Quick Demo Login
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loginMutation.isPending}
          onClick={() => handleDemoLogin("mahfahim51@gmail.com", "@bcD1234")}
          className="flex flex-col items-center justify-center h-auto py-2 px-1 text-xs font-medium gap-1"
        >
          <ShieldCheck className="h-4 w-4 text-red-500" />
          <span>Admin</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loginMutation.isPending}
          onClick={() =>
            handleDemoLogin("fajannat90@gmail.com", "NewPassword123!")
          }
          className="flex flex-col items-center justify-center h-auto py-2 px-1 text-xs font-medium gap-1"
        >
          <GraduationCap className="h-4 w-4 text-blue-500" />
          <span>Instructor</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loginMutation.isPending}
          onClick={() =>
            handleDemoLogin("mahf1919@gmail.com", "NewPassword123!")
          }
          className="flex flex-col items-center justify-center h-auto py-2 px-1 text-xs font-medium gap-1"
        >
          <User className="h-4 w-4 text-emerald-500" />
          <span>Student</span>
        </Button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground font-medium">
            Or
          </span>
        </div>
      </div>

      <GoogleLoginButton onError={(msg) => setApiError(msg)} />
    </AuthCard>
  );
};
