import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
    try {
        const { databases } = createAdminClient();
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date"); // YYYY-MM-DD
        const subjectParam = searchParams.get("subject");

        let tutorIds: string[] | null = null;

        // 1. If date is provided, find tutors available on that date
        if (dateParam) {
            const availResponse = await databases.listDocuments(
                env.APPWRITE_DATABASE_ID,
                "tutor_availabilities", // Hardcoded ID from setup-db.ts, ideally use env or const
                [
                    Query.equal("date", dateParam),
                    Query.limit(100)
                ]
            );

            // Extract unique tutor IDs that have slots
            // We might also want to check if they have *available* slots (not fully booked)?
            // For now, existence of a schedule doc implies availability.
            tutorIds = [...new Set(availResponse.documents.map((doc: any) => doc.tutorId))];

            if (tutorIds.length === 0) {
                return NextResponse.json([]);
            }
        }

        // 2. Build Query for Tutors
        const queries = [
            Query.equal("role", "tutor"),
            Query.limit(100)
        ];

        if (tutorIds) {
            queries.push(Query.equal("$id", tutorIds));
        }

        // Note: Appwrite doesn't support array-contains for simple filtering of subjects efficiently without specific index or usage.
        // We'll filter query-side if possible, or in-memory if not. 
        // Assuming 'subjects' is a string array attribute. Appwrite Query.search or Query.equal can work if indexed.
        // Let's filter in memory for subjects to safely match mock logic for now.

        const response = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_META_COLLECTION_ID,
            queries
        );

        let documents = response.documents;

        if (subjectParam && subjectParam !== "All") {
            documents = documents.filter((doc: any) => doc.subjects?.includes(subjectParam));
        }

        return NextResponse.json(documents);
    } catch (error: any) {
        console.error("Error fetching tutors:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
