// src/components/modules/course/LearningOutcomes.tsx
import { CheckCircle } from "lucide-react";
import type { ILearningOutcome } from "@/types";

interface LearningOutcomesProps {
  outcomes?: ILearningOutcome[];
}

export function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) return null;

  const sortedOutcomes = [...outcomes].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="space-y-4 bg-muted/30 p-6 rounded-xl border">
      <h2 className="text-xl font-bold tracking-tight">What You Will Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedOutcomes.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{item.outcomeText}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
