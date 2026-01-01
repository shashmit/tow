
import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: Request) {
    try {
        const { userId, email, role } = await request.json();

        if (!userId || !email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { databases } = createAdminClient();
        const dbId = "tow-db";
        const colId = "users";

        // Create the user document
        // Use userId as document ID to link 1:1 with Auth User
        await databases.createDocument(
            dbId,
            colId,
            userId,
            {
                email,
                role,
                isOnboardingComplete: false,
                name: "", // Will be filled in onboarding
                phone: "", // Will be filled in onboarding
                age: null // Will be filled in onboarding
            }
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Create User Doc Error:", error);
        // If document already exists, strictly speaking we can return success or error. 
        // For now, if it allows us to proceed, return success.
        if (error.code === 409) {
            return NextResponse.json({ success: true, message: "User already exists" });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
