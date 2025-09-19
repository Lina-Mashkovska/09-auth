import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const PROTECTED_PATHS = ["/profile", "/notes"];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isPublicPath && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (isProtectedPath) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshRes.ok) {
          return NextResponse.next();
        }
      } catch (err) {
        console.error("Middleware refresh error:", err);
      }
    }

    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
