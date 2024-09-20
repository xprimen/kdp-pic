import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/secure")) {
    if (!request.cookies.get("refreshToken")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (request.cookies.get("refreshToken")) {
      return NextResponse.redirect(new URL("/secure", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/secure", "/secure/:path*", "/"],
};
