// src/app/verify/[certificateUid]/page.tsx
import { CertificateVerificationCard } from "@/components/modules/certificate/CertificateVerificationCard";

interface VerifyPageProps {
  params: Promise<{
    certificateUid: string;
  }>;
}

export default async function VerifyCertificatePage({
  params,
}: VerifyPageProps) {
  const { certificateUid } = await params;

  return (
    <main className="container mx-auto min-h-screen py-12 px-4 flex flex-col items-center justify-center">
      <div className="text-center mb-8 max-w-lg space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Certificate Verification
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Verify digital credentials issued by Code BD Code Learning Platform.
        </p>
      </div>

      <CertificateVerificationCard initialUid={certificateUid} />
    </main>
  );
}
