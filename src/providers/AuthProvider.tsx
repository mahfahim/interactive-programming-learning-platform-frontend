"use client";

import { useEffect, useRef } from "react";
import { useRefreshToken } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store";
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
          setAuth(authData.data.user, authData.data.accessToken);
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
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
