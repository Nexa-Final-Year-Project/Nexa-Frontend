import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/auth",
  "/login", // ✅ Add this!
  "/callback",
  "/complete-sign-in",
  "/about-us",
  "/about",
  "/terms",
  "/term&condition",
  "/salespage",
];

const STATIC_FILES = ["/_next", "/images", "/favicon.ico", "/robots.txt"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Match cookie name with backend
  const token = request.cookies.get("token")?.value;

  // Skip middleware for static files
  if (STATIC_FILES.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Public route check
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users away from protected routes
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow public routes without token
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If token exists, verify it
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
      {
        method: "POST", // ✅ Must specify
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!resp.ok) {
      throw new Error("Token verification failed");
    }

    const data = await resp.json();

    // Example: check role
    if (!data?.uid) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);

    // Clear invalid token and redirect
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token"); // ✅ Delete correct cookie name
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon.ico|robots.txt).*)"],
};
