import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Role } from "@/types/enum.type";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  console.log("👉 Token in Cookie:", accessToken);

  const decodedData = accessToken ? decodeToken(accessToken) : null;
  const userRole = decodedData?.role as Role | undefined;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const isAdminRoute = pathname.startsWith("/admin");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isStudentRoute = pathname.startsWith("/student");
  const isProfileRoute = pathname.startsWith("/profile");

  const isProtectedRoute =
    isAdminRoute || isInstructorRoute || isStudentRoute || isProfileRoute;

  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isAuthRoute) {
    let redirectPath = "/profile";
    if (userRole === Role.ADMIN) redirectPath = "/admin";
    else if (userRole === Role.INSTRUCTOR) redirectPath = "/instructor";
    else if (userRole === Role.STUDENT) redirectPath = "/student";

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (accessToken && isProtectedRoute) {
    if (isAdminRoute && userRole !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    if (isInstructorRoute && userRole !== Role.INSTRUCTOR) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    if (isStudentRoute && userRole !== Role.STUDENT) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
