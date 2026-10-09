"use client";

import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  SquareCode,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store"; // 1. আপনার Auth Store-এর সঠিক পাথ দিন

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // 2. Zustand Store থেকে সরাসরি ইউজার পান
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = !!user;

  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      setMobileMenuOpen(false);
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary"
        >
          <SquareCode className="h-6 w-6 text-primary" />
          <span>Code BD Code </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>

          {!isLoggedIn && (
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Courses
            </Link>
          )}

          {isLoggedIn && (
            <Link
              href="/student"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Action Area */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user?.imageUrl || "/avatar-placeholder.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold uppercase">
                      {user?.name ? user.name.slice(0, 2) : "ST"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "Student"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/student" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/student/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isPending ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 pb-6 pt-2 transition-all">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {!isLoggedIn && (
              <Link
                href="/courses"
                className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>
            )}

            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="text-sm font-medium py-2 text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            )}

            <div className="pt-2 border-t flex flex-col gap-2">
              {isLoggedIn ? (
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isPending ? "Logging out..." : "Log out"}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
