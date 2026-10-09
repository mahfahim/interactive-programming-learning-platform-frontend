"use client";

import { useParams } from "next/navigation";
import { AdminLessonDetails } from "@/components/modules/lesson/ManageLessonDetails";

export default function AdminLessonDetailsPage() {
  const params = useParams();
  const { lessonId } = params as { lessonId: string };

  return (
    <div className="p-6">
      <AdminLessonDetails lessonId={lessonId} />
    </div>
  );
}
