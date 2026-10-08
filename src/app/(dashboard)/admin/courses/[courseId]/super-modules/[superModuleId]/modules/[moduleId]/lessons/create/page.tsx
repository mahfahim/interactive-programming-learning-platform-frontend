"use client";

import { useParams } from "next/navigation";
import { CreateLessonForm } from "@/components/modules/lesson/CreateLessonForm";

export default function CreateLessonPage() {
  const params = useParams();
  const { courseId, superModuleId, moduleId } = params as {
    courseId: string;
    superModuleId: string;
    moduleId: string;
  };

  return (
    <div className="p-6">
      <CreateLessonForm
        moduleId={moduleId}
        courseId={courseId}
        superModuleId={superModuleId}
      />
    </div>
  );
}
