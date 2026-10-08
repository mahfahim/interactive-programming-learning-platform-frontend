// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/modules/[moduleId]/edit/page.tsx
import { EditModule } from "@/components/modules/module/EditModule";

interface EditModulePageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
    moduleId: string;
  }>;
}

export default async function EditModulePage({ params }: EditModulePageProps) {
  const { courseId, superModuleId, moduleId } = await params;

  return (
    <EditModule
      courseId={courseId}
      superModuleId={superModuleId}
      moduleId={moduleId}
    />
  );
}
