// src/app/(public)
"use client";

import { useParams } from "next/navigation";
import { StudentLessonDetails } from "@/components/modules/lesson/StudentLessonDetails";

export default function StudentLessonDetailsPage() {
  const params = useParams();
  const { lessonId } = params as { lessonId: string };

  return (
    <div className="p-6">
      <StudentLessonDetails lessonId={lessonId} />
    </div>
  );
}
