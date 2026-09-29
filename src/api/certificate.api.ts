import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICertificateResponse,
  ICertificateVerificationResponse,
} from "@/types";

export function getMyCertificate(courseId: string) {
  return apiClient<ApiResponse<ICertificateResponse>>(
    `/api/v1/certificates/my-certificate/${courseId}`,
  );
}

export function verifyCertificate(certificateUid: string) {
  return apiClient<ApiResponse<ICertificateVerificationResponse>>(
    `/api/v1/certificates/verify/${certificateUid}`,
  );
}
