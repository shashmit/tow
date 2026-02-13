import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Client, Account } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { signSessionJWT } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 1. Verify Credentials using a separate stateless client
        // We do not use the Admin Key here, just the project ID
        const client = new Client()
            .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
            .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

        const account = new Account(client);

        try {
            // This will throw if credentials are invalid
            const session = await account.createEmailPasswordSession(email, password);

            // Cleanup: We don't need the Appwrite session, we are issuing our own JWT
            // We can delete it to keep things clean, but it requires the session ID.
            // To delete it, we'd need to set the session on the client? 
            // Actually, createEmailPasswordSession sets the session cookie in the client usually, 
            // but in Node it might just return it. 
            // For now, we will ignore the Appwrite session cleanup to avoid complexity, 
            // as it doesn't harm the user (just an unused session in Appwrite).
            // Or we can delete it if we want to be strict.

            const userId = session.userId;

            // 2. Fetch User Meta/Role
            const { databases } = createAdminClient();
            const meta = await databases.getDocument(
                env.APPWRITE_DATABASE_ID,
                env.APPWRITE_USER_META_COLLECTION_ID,
                userId
            );

            const role = meta.role;
            const isCompleted = meta.onboardingCompleted;

            // 3. Issue Session JWT with onboarding status
            const token = await signSessionJWT({ userId, role, onboardingCompleted: isCompleted });

            // Set HTTP-only cookie
            (await cookies()).set("session_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            // Return onboarding status to client
            if (!isCompleted) {
                return NextResponse.json({
                    onboardingRequired: true,
                });
            }

            return NextResponse.json({
                success: true,
            });

        } catch (error: unknown) {
            console.error("Login auth error:", error);
            const err = error as { type?: string; code?: number };
            if (err?.type === 'user_invalid_credentials' || err?.code === 401) {
                return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            }
            throw error;
        }

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
