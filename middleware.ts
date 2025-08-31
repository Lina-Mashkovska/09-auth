import { NextResponse, type NextRequest } from "next/server";

// Публічні сторінки, доступні без авторизації
const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

const isPublic = (p: string) => PUBLIC_PATHS.includes(p);
const isPrivate = (p: string) => p.startsWith("/profile") || p.startsWith("/notes");

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Кука ставиться app/api-роутами (готовими з репо курсу)
  const hasToken = Boolean(req.cookies.get("accessToken"));

  // ❌ Якщо користувач не авторизований і лізе на приватну сторінку — шлемо на /sign-in
  if (isPrivate(pathname) && !hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    // щоб після логіну повернути на потрібну сторінку
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // ✅ Якщо авторизований — не пускаємо на публічні /sign-in, /sign-up
  if (isPublic(pathname) && hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Запускаємо middleware для всіх сторінок (крім статичних/asset файлів)
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)"],
};

