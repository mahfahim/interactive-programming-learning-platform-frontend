// src/app/(dashboard)/admin/courses/[courseId]/super-modules/[superModuleId]/edit/page.tsx
import { EditSuperModule } from "@/components/modules/superModule/EditSuperModule";

interface EditSuperModulePageProps {
  params: Promise<{
    courseId: string;
    superModuleId: string;
  }>;
}

export default async function EditSuperModulePage({
  params,
}: EditSuperModulePageProps) {
  const { courseId, superModuleId } = await params;

  return <EditSuperModule courseId={courseId} superModuleId={superModuleId} />;
}
