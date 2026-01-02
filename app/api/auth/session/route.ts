import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth/jwt";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    if (!token) {
        return NextResponse.json({ authenticated: false });
    }

    const payload = await verifyJWT(token);

    if (!payload) {
        return NextResponse.json({ authenticated: false });
    }

    // Check if it's a full session or just an onboarding token
    const isOnboarding = payload.type === "onboarding";

    return NextResponse.json({
        authenticated: true,
        isOnboarding,
        userId: payload.userId,
        role: payload.role,
    });
}
