import apiClient from "@/lib/apiClient";
import type { ApiResponse, IQuery } from "@/types";

export function getMyPayments(params?: IQuery) {
  return apiClient<ApiResponse>("/api/v1/payment/my-payments", {
    params,
  });
}

export function getAllPayments(params?: IQuery) {
  return apiClient<ApiResponse>("/api/v1/payment/all-payments", {
    params,
  });
}

export function getSinglePayment(paymentId: string) {
  return apiClient<ApiResponse>(`/api/v1/payment/${paymentId}`);
}

export function initiateRefund(
  paymentId: string,
  payload?: { reason?: string },
) {
  return apiClient<ApiResponse>(`/api/v1/payment/refund/${paymentId}`, {
    method: "POST",
    body: payload,
  });
}
