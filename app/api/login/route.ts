import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// Allowed logins come from env vars:
//  - ADMIN_USER / ADMIN_PASSWORD  (the original single admin)
//  - AUTH_USERS: extra users as "email:password" pairs, separated by newlines or commas
//    e.g.  Tesla@sunvena.com:Solar123!
// Emails are matched case-insensitively; passwords are exact.
function allowedUsers(): { u: string; p: string }[] {
  const list: { u: string; p: string }[] = [];
  if (process.env.ADMIN_USER && process.env.ADMIN_PASSWORD) {
    list.push({ u: process.env.ADMIN_USER, p: process.env.ADMIN_PASSWORD });
  }
  for (const entry of (process.env.AUTH_USERS ?? "").split(/[\n,]+/)) {
    const s = entry.trim();
    if (!s) continue;
    const i = s.indexOf(":");
    if (i < 0) continue;
    list.push({ u: s.slice(0, i).trim(), p: s.slice(i + 1) });
  }
  return list;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const match = allowedUsers().find(
    (x) => x.u.toLowerCase() === username.toLowerCase()
  );
  const ok = !!match && safeEqual(password, match.p);

  const origin = new URL(req.url).origin;

  if (!ok) {
    return NextResponse.redirect(new URL("/login?error=1", origin), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/app/index.html", origin), { status: 303 });
  res.cookies.set("sv_auth", process.env.SESSION_SECRET ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}
