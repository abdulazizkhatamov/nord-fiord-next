import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "./lib/prisma";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // 1. /admin/sign-up: Only allow if no users exist
  if (path.startsWith("/admin/signup")) {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      // Redirect to sign-in if users already exist
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2. /admin/sign-in: Only allow if NOT logged in
  if (path.startsWith("/admin/signin")) {
    if (session) {
      // already logged in, redirect to admin dashboard
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 3. /admin/*: Require login
  if (path.startsWith("/admin")) {
    if (!session) {
      // not logged in, redirect to sign-in
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 4. everything else (public) → allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // apply proxy to all /admin routes
};
