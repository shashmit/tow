import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define Public Routes
    const publicRoutes = [
        "/",
        "/login",
        "/register",
        "/api/auth/check-email",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/session",
        "/api/auth/logout",
        "/global.css",
        "/logo.ico",
    ];

    // Also exclude Next.js internals and assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/public") ||
        publicRoutes.includes(pathname)
    ) {
        return NextResponse.next();
    }

    // 2. Extract Token
    const token = request.cookies.get("session_token")?.value ||
        request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        // Return 401 for API, Redirect for Page
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Verify Token
    const payload = await verifyJWT(token);

    if (!payload) {
        // Return 401 for API, Redirect for Page
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (payload.type === 'onboarding') {
        // If it's an onboarding token, only allow access to onboarding-related routes
        const allowedOnboardingPaths = [
            "/onboarding",
            "/api/auth/onboarding",
            "/api/subjects",
        ];
        const isAllowed = allowedOnboardingPaths.some(p => pathname.startsWith(p));
        if (!isAllowed) {
            if (pathname.startsWith("/api")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/onboarding", request.url));
        }
    }

    // 4. Attach User Info to Headers (Optional, for easy access in handlers)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-role", payload.role as string);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|logo.ico).*)',
    ],
};
