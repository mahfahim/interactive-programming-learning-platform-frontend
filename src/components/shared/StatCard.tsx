import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardContent className="p-4 sm:p-6 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </CardContent>
    </Card>
  );
}