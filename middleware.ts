// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

// публічні та приватні маршрути
const PUBLIC_PATHS = ["/sign-in", "/sign-up"];
const PROTECTED_PATHS = ["/profile", "/notes", "/notes/filter"];

const isPublicPath = (p: string) => PUBLIC_PATHS.some((x) => p.startsWith(x));
const isProtectedPath = (p: string) => PROTECTED_PATHS.some((x) => p.startsWith(x));

// Дістаємо масив set-cookie із заголовків відповіді (без any)
function extractSetCookies(headers: unknown): string[] {
  if (typeof headers !== "object" || headers === null) return [];
  const raw = (headers as Record<string, unknown>)["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw)
    ? raw.filter((v): v is string => typeof v === "string")
    : typeof raw === "string"
    ? [raw]
    : [];
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // куки беремо з запиту (edge-safe)
  const cookieHeader = req.headers.get("cookie") ?? "";

  let isAuthenticated = false;
  let setCookieHeaders: string[] = [];

  try {
    // checkSession повертає ПОВНИЙ AxiosResponse<User | null>
    const resp = await checkSession(cookieHeader);
    isAuthenticated = Boolean(resp.data);
    setCookieHeaders = extractSetCookies(resp.headers);
  } catch {
    isAuthenticated = false;
  }

  // неавторизований → приватні сторінки → редірект на /sign-in
  if (!isAuthenticated && isProtectedPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    const res = NextResponse.redirect(url);
    for (const c of setCookieHeaders) res.headers.append("set-cookie", c);
    return res;
  }

  // авторизований → публічні сторінки → редірект на головну (/)
  if (isAuthenticated && isPublicPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    const res = NextResponse.redirect(url);
    for (const c of setCookieHeaders) res.headers.append("set-cookie", c);
    return res;
  }

  // пропускаємо далі + прокидуємо можливі оновлені куки
  const res = NextResponse.next();
  for (const c of setCookieHeaders) res.headers.append("set-cookie", c);
  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};








