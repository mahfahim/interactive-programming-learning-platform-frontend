// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/modules/[moduleId]/page.tsx
import { ModuleDetailsContainer } from "@/components/modules/module/ModuleDetailsContainer";

interface ModuleDetailsPageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
    moduleId: string;
  }>;
}

export default async function ModuleDetailsPage({
  params,
}: ModuleDetailsPageProps) {
  const { courseId, superModuleId, moduleId } = await params;

  return (
    <ModuleDetailsContainer
      courseId={courseId}
      superModuleId={superModuleId}
      moduleId={moduleId}
    />
  );
}
