import axios from "axios";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axiosInstance from "./lib/axiosInstance";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // console.log(request.cookies.get("token"));
  if (request.nextUrl.pathname.startsWith("/secure")) {
    if (!request.cookies.get("refreshToken")) {
      return NextResponse.redirect(new URL("/", request.url));
    } /* else {
      const refreshToken = request.cookies.get("refreshToken")?.value!;
      await axiosInstance(refreshToken)
        .get("/token")
        .then((res) => {
          console.log("New Token Server :", res.data.accessToken);
          cookies().set("token", res.data.accessToken, {
            path: "/",
            httpOnly: process.env.NODE_ENV === "production" ? true : false,
            secure: process.env.NODE_ENV === "production" ? true : false,
          });
        });
    } */
  } else {
    if (request.cookies.get("refreshToken")) {
      return NextResponse.redirect(new URL("/secure", request.url));
      // console.log("tes");
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/secure", "/secure/:path*", "/"],
};
