import { NextResponse, type NextRequest } from "next/server";


const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

const isPublic = (p: string) => PUBLIC_PATHS.includes(p);
const isPrivate = (p: string) => p.startsWith("/profile") || p.startsWith("/notes");

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  const hasToken = Boolean(req.cookies.get("accessToken"));


  if (isPrivate(pathname) && !hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";

    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  
  if (isPublic(pathname) && hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)"],
};