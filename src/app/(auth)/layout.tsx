import { SquareCode } from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary-foreground/10 pointer-events-none" />

        {/* Desktop Branding with Home Link */}
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-3 w-fit transition-opacity hover:opacity-90"
        >
          <div className="p-2.5 rounded-xl bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20">
            <SquareCode className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Code BD Code</span>
        </Link>

        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Master programming through interactive learning.
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Access world-class course materials, automated code evaluation,
            hands-on quizzes, and real-time community guidance.
          </p>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Code BD Code. All rights reserved.
        </div>
      </div>

      {/* Right Auth Container */}
      <div className="flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 min-h-screen">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Branding Header with Home Link */}
          <div className="flex lg:hidden justify-center items-center mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <SquareCode className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Code BD Code
              </span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}