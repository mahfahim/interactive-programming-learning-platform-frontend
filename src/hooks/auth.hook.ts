import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  forgotPassword,
  googleLogin,
  loginUser,
  logout,
  refreshToken,
  registerPatient,
  resetPassword,
  verifyPatientEmail,
} from "@/api/auth.api"; // Adjust path to match your API directory
import type {
  ApiResponse,
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginUserPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/types";

// Custom Hooks

//  Register a new patient account.

type UseRegisterPatientOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IRegisterPayload
>;

export function useRegisterPatient(options?: UseRegisterPatientOptions) {
  return useMutation({
    mutationFn: registerPatient,
    ...options,
  });
}

//  Verify patient email address using a verification token/OTP.

type UseVerifyPatientEmailOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IVerifyEmailPayload
>;

export function useVerifyPatientEmail(options?: UseVerifyPatientEmailOptions) {
  return useMutation({
    mutationFn: verifyPatientEmail,
    ...options,
  });
}

//  Authenticate user with credentials.

type UseLoginUserOptions = UseMutationOptions<
  ApiResponse,
  Error,
  ILoginUserPayload
>;

export function useLoginUser(options?: UseLoginUserOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

//  Log out the current user session and clear React Query cache.

type UseLogoutOptions = UseMutationOptions<ApiResponse, Error, void>;

export function useLogout(options?: UseLogoutOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: (...args) => {
      queryClient.clear();
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

//  Refresh current authentication access token.

type UseRefreshTokenOptions = UseMutationOptions<ApiResponse, Error, void>;

export function useRefreshToken(options?: UseRefreshTokenOptions) {
  return useMutation({
    mutationFn: refreshToken,
    ...options,
  });
}

//  Authenticate user with Google OAuth credentials.

type UseGoogleLoginOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IGoogleLoginPayload
>;

export function useGoogleLogin(options?: UseGoogleLoginOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (...args) => {
      queryClient.invalidateQueries();
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

//  Request a password reset link/code via email.

type UseForgotPasswordOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IForgotPasswordPayload
>;

export function useForgotPassword(options?: UseForgotPasswordOptions) {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
}

//  Reset user password with token and new password.

type UseResetPasswordOptions = UseMutationOptions<
  ApiResponse,
  Error,
  IResetPasswordPayload
>;

export function useResetPassword(options?: UseResetPasswordOptions) {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
}
