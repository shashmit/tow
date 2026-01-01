
import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId, data } = await request.json();

        if (!userId || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { databases } = createAdminClient();
        const dbId = "tow-db";
        const colId = "users";

        // Update document
        await databases.updateDocument(
            dbId,
            colId,
            userId,
            {
                ...data,
                isOnboardingComplete: true
            }
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Complete Onboarding Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
