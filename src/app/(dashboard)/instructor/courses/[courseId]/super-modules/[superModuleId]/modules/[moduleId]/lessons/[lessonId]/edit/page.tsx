"use client";

import { useParams } from "next/navigation";
import { EditLessonForm } from "@/components/modules/lesson/EditLessonForm";
import { useGetLessonById } from "@/hooks/lesson.hook";

export default function EditLessonPage() {
  const params = useParams();
  const { courseId, superModuleId, moduleId, lessonId } = params as {
    courseId: string;
    superModuleId: string;
    moduleId: string;
    lessonId: string;
  };

  const { data: response, isLoading } = useGetLessonById(lessonId);

  if (isLoading) return <div className="p-6">Loading lesson data...</div>;

  const lesson = response?.data;

  if (!lesson) return <div className="p-6 text-red-500">Lesson not found.</div>;

  return (
    <div className="p-6">
      <EditLessonForm
        lesson={lesson}
        courseId={courseId}
        superModuleId={superModuleId}
        moduleId={moduleId}
      />
    </div>
  );
}
