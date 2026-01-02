import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ tutorId: string }> }
) {
    try {
        const { tutorId } = await params;
        const { databases } = createAdminClient();

        if (!tutorId) {
            return NextResponse.json({ error: "Tutor ID is required" }, { status: 400 });
        }

        const tutor = await databases.getDocument(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_META_COLLECTION_ID,
            tutorId
        );

        return NextResponse.json(tutor);
    } catch (error: any) {
        console.error(`Error fetching tutor ${await params}:`, error);
        return NextResponse.json(
            { error: "Tutor not found or internal server error", details: error.message },
            { status: error.code === 404 ? 404 : 500 }
        );
    }
}
