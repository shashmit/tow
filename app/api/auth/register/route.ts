import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
    try {
        const { email, password, role } = await request.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { users, databases } = createAdminClient();

        // 1. Create Appwrite User
        const user = await users.create(ID.unique(), email, undefined, password);
        await users.updatePrefs(user.$id, { role });

        // 2. Create user_meta document
        // Using user.$id as the document ID for easy lookup
        await databases.createDocument(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_META_COLLECTION_ID,
            user.$id,
            {
                email,
                role,
                onboardingCompleted: false,
            }
        );

        return NextResponse.json({ success: true, userId: user.$id });
    } catch (error: unknown) {
        console.error("Registration error:", error);
        // Handle duplicate email error from Appwrite
        const err = error as { code?: number };
        if (err?.code === 409) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
