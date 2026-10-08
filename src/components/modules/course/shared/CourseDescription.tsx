// src/components/modules/course/CourseDescription.tsx
interface CourseDescriptionProps {
  fullDescription?: string;
}

export function CourseDescription({ fullDescription }: CourseDescriptionProps) {
  if (!fullDescription) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold tracking-tight">About This Course</h2>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
        {fullDescription}
      </div>
    </div>
  );
}
