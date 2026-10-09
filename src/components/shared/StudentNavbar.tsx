"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, BookOpen, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const StudentNavbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { mutate: handleLogout, isPending } = useLogout({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  return (
    <header className="border-b bg-card sticky top-0 z-50 shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo & Student Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/student" className="text-lg sm:text-xl font-bold text-primary">
            LMS Portal
          </Link>
          <span className="bg-emerald-500/10 text-emerald-600 text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Student
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/student"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href="/student/my-courses"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <BookOpen className="h-4 w-4" /> My Courses
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 border-l pl-2 sm:pl-4 border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              title="Logout"
              onClick={() => handleLogout()}
              disabled={isPending}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <LogOut className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-card px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/student"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              href="/student/my-courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <BookOpen className="h-4 w-4" /> My Courses
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};