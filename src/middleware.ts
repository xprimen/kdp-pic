import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // console.log(request.cookies.get("token"));
  if (request.nextUrl.pathname.startsWith("/secure")) {
    if (!request.cookies.get("token")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (request.cookies.get("token")) {
      return NextResponse.redirect(new URL("/secure", request.url));
      // console.log("tes");
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/secure/:path*", "/"],
};
