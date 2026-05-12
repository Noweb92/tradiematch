import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Public routes — accessible without auth (the demo + marketing pages).
const PUBLIC_ROUTES = new Set<string>([
  "/",
  "/onboarding",
  "/swipe",
  "/match",
  "/chat",
  "/dashboard",
  "/pricing",
  "/investor",
  "/discovery",
  "/login",
  "/signup",
  "/signup/customer",
  "/signup/tradie",
  "/forgot-password",
  "/reset-password",
  "/legal/privacy",
  "/legal/terms",
  "/legal/refund",
  "/about",
  "/help",
]);

const PUBLIC_PREFIXES = ["/auth/", "/api/abn", "/api/webhooks/"];

function isPublic(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  // If Supabase env vars are not configured (e.g. during the visual demo phase),
  // skip auth checks entirely so the static demo keeps working.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  const { response, supabase, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Public route → just refresh session
  if (isPublic(pathname)) {
    return response;
  }

  // Below this point: protected routes
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Role-gated routes
  if (
    pathname.startsWith("/app/customer") ||
    pathname.startsWith("/app/tradie") ||
    pathname.startsWith("/app/admin")
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    if (pathname.startsWith("/app/customer") && role !== "customer") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/app/tradie") && role !== "tradie") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/app/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
