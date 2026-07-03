import { NextResponse } from "next/server";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  const okUser = safeEqual(
    username.toLowerCase(),
    (process.env.ADMIN_USER ?? "").toLowerCase()
  );
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD ?? "");

  const origin = new URL(req.url).origin;

  if (!okUser || !okPass) {
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
