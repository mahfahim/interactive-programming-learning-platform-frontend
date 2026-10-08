// src/components/modules/course/Prerequisites.tsx
import type { IPrerequisite } from "@/types";

interface PrerequisitesProps {
  prerequisites?: IPrerequisite[];
}

export function Prerequisites({ prerequisites }: PrerequisitesProps) {
  if (!prerequisites || prerequisites.length === 0) return null;

  const sortedPrereqs = [...prerequisites].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold tracking-tight">
        Requirements & Prerequisites
      </h2>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground text-sm">
        {sortedPrereqs.map((item, index) => (
          <li key={item.id || index}>{item.prerequisiteText}</li>
        ))}
      </ul>
    </div>
  );
}
