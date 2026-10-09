"use client";

import { useEffect, useRef } from "react";
import { useRefreshToken } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store";
import GlobalSkeleton from "@/components/shared/GlobalSkeleton";
import type { ApiResponse, User } from "@/types";

interface RefreshTokenResponse extends ApiResponse {
  data: {
    user: User;
    accessToken?: string;
  };
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setAuth, logout, isLoading, setLoading } = useAuthStore();
  const { mutate: refreshToken } = useRefreshToken();

  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    refreshToken(undefined, {
      onSuccess: (response) => {
        const authData = response as RefreshTokenResponse;
        if (authData?.data?.user) {
          // Pure HttpOnly Cookie ব্যবহারের কারণে এখানে কেবল user পাস করতে হবে
          setAuth(authData.data.user);
        } else {
          logout();
        }
      },
      onError: () => {
        logout();
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  }, [refreshToken, setAuth, logout, setLoading]);

  if (isLoading) {
    return <GlobalSkeleton />;
  }

  return <>{children}</>;
}