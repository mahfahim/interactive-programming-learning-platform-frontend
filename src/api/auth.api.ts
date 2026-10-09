import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginUserPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/types";

export interface IRefreshTokenPayload {
  refreshToken?: string;
}

export function registerPatient(payload: IRegisterPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyPatientEmail(payload: IVerifyEmailPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function loginUser(payload: ILoginUserPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function logout(payload?: IRefreshTokenPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/logout", {
    method: "POST",
    body: payload,
  });
}

export function refreshToken(payload?: IRefreshTokenPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/refresh-token", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(payload: IGoogleLoginPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: IForgotPasswordPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: IResetPasswordPayload) {
  return apiClient<ApiResponse>("/api/v1/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}