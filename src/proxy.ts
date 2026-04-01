import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlHandler = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // Team Hub and Management live outside locale routing — pass through directly
  if (
    request.nextUrl.pathname.startsWith("/team-hub") ||
    request.nextUrl.pathname.startsWith("/management")
  ) {
    return NextResponse.next();
  }
  return intlHandler(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
