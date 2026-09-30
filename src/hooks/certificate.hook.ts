import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getMyCertificate, verifyCertificate } from "@/api/certificate.api";
import type {
  ApiResponse,
  ICertificateResponse,
  ICertificateVerificationResponse,
} from "@/types";

// Query Keys Factory

export const certificateKeys = {
  all: ["certificates"] as const,
  myCertificate: (courseId: string) =>
    [...certificateKeys.all, "my-certificate", courseId] as const,
  verify: (certificateUid: string) =>
    [...certificateKeys.all, "verify", certificateUid] as const,
};

// Custom Hooks

type UseGetMyCertificateOptions = Omit<
  UseQueryOptions<ApiResponse<ICertificateResponse>>,
  "queryKey" | "queryFn"
>;

//  Hook to fetch the current user's certificate for a specific course.

//   @param courseId - The ID of the course
//  @param options - Additional TanStack React Query options

export function useGetMyCertificate(
  courseId: string,
  options?: UseGetMyCertificateOptions,
) {
  return useQuery({
    queryKey: certificateKeys.myCertificate(courseId),
    queryFn: () => getMyCertificate(courseId),
    enabled: !!courseId,
    ...options,
  });
}

type UseVerifyCertificateOptions = Omit<
  UseQueryOptions<ApiResponse<ICertificateVerificationResponse>>,
  "queryKey" | "queryFn"
>;

//   Hook to verify a certificate by its unique identifier.

//   @param certificateUid - The unique identifier of the certificate
//   @param options - Additional TanStack React Query options

export function useVerifyCertificate(
  certificateUid: string,
  options?: UseVerifyCertificateOptions,
) {
  return useQuery({
    queryKey: certificateKeys.verify(certificateUid),
    queryFn: () => verifyCertificate(certificateUid),
    enabled: !!certificateUid,
    ...options,
  });
}
