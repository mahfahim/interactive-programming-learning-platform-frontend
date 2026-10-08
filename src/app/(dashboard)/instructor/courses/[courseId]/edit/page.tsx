// src/app/(dashboard)/admin/courses/[courseId]/edit/page.tsx

import { EditCourse } from "@/components/modules/course/EditCourse";

interface EditCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { courseId } = await params;
  return <EditCourse courseId={courseId} />;
}
