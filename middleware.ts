// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isPrivate = (p: string) => p.startsWith("/profile") || p.startsWith("/notes");
const isAuthPath = (p: string) => p === "/sign-in" || p === "/sign-up";

async function hasSession(req: NextRequest): Promise<boolean> {
  try {
    const url = new URL("/api/auth/session", req.nextUrl.origin);
    const res = await fetch(url, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const body = await res.text();
    return !!body && body.trim() !== "" && body !== "null" && body !== "undefined";
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // пропускаємо статичні та api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(?:png|jpg|jpeg|gif|svg|ico|css|js|txt|webp|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  const authed = await hasSession(req);

  if (!authed && isPrivate(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (authed && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
