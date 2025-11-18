// middleware.ts

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import logger from "./utils/logger";

// Define paths that should remain public
const publicPaths = ["/auth/signin", "/auth/signup"];

export async function middleware(req: NextRequest) {
  // Get the user's session token (JWT)
  const token = await getToken({ req, secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET });
  logger.debug(token, "token");
  const url = req.url;
  logger.debug(req, "url");

  // If the requested URL is NOT a public path and the user is not authenticated, redirect to sign-in page
  if (!publicPaths.some((path) => url.includes(path)) && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  if (req.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Optionally, check for specific roles if you want role-based access (e.g., Admin routes)
  // Example: If accessing an admin route, the user must have 'ADMIN' role
  if (url.includes("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/signin", req.url)); // Redirect if user is not Admin
  }

  return NextResponse.next();
}

// Specify paths where the middleware should apply
export const config = {
  matcher: ["/admin/:path*", "//:path*", "/user/settings/:path*"], // Apply to all paths
};
