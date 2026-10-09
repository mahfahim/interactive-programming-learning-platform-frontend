// src/app/(dashboard)/courses/[courseId]/certificate/page.tsx
import { CourseCertificateCard } from "@/components/modules/certificate/CourseCertificateCard";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
  const { courseId } = await params;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Course Completion Certificate</h1>
      <CourseCertificateCard courseId={courseId} />
    </main>
  );
}
