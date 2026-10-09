"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth.hook";

interface DashboardHeaderProps {
  userRole?: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

export function DashboardHeader({ userRole = "ADMIN" }: DashboardHeaderProps) {
  const router = useRouter();

  const { mutate: logout, isPending } = useLogout({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-3 sm:px-6 backdrop-blur">
      {/* Left Side: Sidebar Trigger & Welcome Greeting */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile / Desktop Sidebar Toggle Button */}
        <SidebarTrigger />

        <div>
          <h2 className="text-xs sm:text-sm font-semibold truncate">Welcome back!</h2>
          <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
            {userRole.toLowerCase()} Dashboard
          </p>
        </div>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Button */}
        <Button variant="ghost" size="icon" className="relative rounded-full h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src="/avatar-placeholder.png" alt="User Avatar" />
                <AvatarFallback className="uppercase text-xs sm:text-sm">
                  {userRole.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
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
      </div>
    </header>
  );
}