"use client";

import { Inbox, type LucideIcon } from "lucide-react";

interface UserEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function UserEmptyState({
  title = "No information provided",
  description = "There are no records added for this section yet.",
  icon: Icon = Inbox,
  action,
}: UserEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-muted/20 border-dashed">
      <div className="p-3 bg-muted rounded-full mb-2 text-muted-foreground">
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs mt-0.5 mb-3">
        {description}
      </p>
      {action}
    </div>
  );
}
