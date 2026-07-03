import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that never require auth.
const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET;
  const authed = !!secret && req.cookies.get("sv_auth")?.value === secret;
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
