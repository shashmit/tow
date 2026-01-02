import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";

const SUBJECTS_COLLECTION_ID = "subjects";

export async function GET() {
    try {
        const { databases } = createAdminClient();

        const response = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            SUBJECTS_COLLECTION_ID
        );

        const subjects = response.documents.map(doc => ({
            id: doc.$id,
            name: doc.name,
            slug: doc.slug,
            category: doc.category,
            description: doc.description,
        }));

        return NextResponse.json({ subjects });

    } catch (error: any) {
        console.error("Error fetching subjects:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch subjects" },
            { status: 500 }
        );
    }
}
