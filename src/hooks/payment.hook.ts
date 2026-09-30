import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllPayments,
  getMyPayments,
  getSinglePayment,
  initiateRefund,
} from "@/api/payment.api";
import type { ApiResponse, IQuery } from "@/types";

// Query Keys Factory
export const paymentKeys = {
  all: ["payments"] as const,
  myPayments: (params?: IQuery) =>
    [...paymentKeys.all, "my-payments", params] as const,
  allPayments: (params?: IQuery) =>
    [...paymentKeys.all, "all-payments", params] as const,
  details: () => [...paymentKeys.all, "detail"] as const,
  detail: (paymentId: string) => [...paymentKeys.details(), paymentId] as const,
};

// Types
type InitiateRefundVariables = {
  paymentId: string;
  payload?: { reason?: string };
};

type UseGetMyPaymentsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetAllPaymentsOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseGetSinglePaymentOptions = Omit<
  UseQueryOptions<ApiResponse>,
  "queryKey" | "queryFn"
>;

type UseInitiateRefundOptions = Omit<
  UseMutationOptions<ApiResponse, Error, InitiateRefundVariables>,
  "mutationFn"
>;

// Hooks - Queries

// Fetch current user payments
export function useGetMyPayments(
  params?: IQuery,
  options?: UseGetMyPaymentsOptions,
) {
  return useQuery({
    queryKey: paymentKeys.myPayments(params),
    queryFn: () => getMyPayments(params),
    ...options,
  });
}

// Fetch all payments (Admin / Manager)
export function useGetAllPayments(
  params?: IQuery,
  options?: UseGetAllPaymentsOptions,
) {
  return useQuery({
    queryKey: paymentKeys.allPayments(params),
    queryFn: () => getAllPayments(params),
    ...options,
  });
}

// Fetch details of a single payment by ID
export function useGetSinglePayment(
  paymentId: string,
  options?: UseGetSinglePaymentOptions,
) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getSinglePayment(paymentId),
    enabled: !!paymentId,
    ...options,
  });
}

// Hooks - Mutations

// Initiate refund process for a payment
export function useInitiateRefund(options?: UseInitiateRefundOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, payload }: InitiateRefundVariables) =>
      initiateRefund(paymentId, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
