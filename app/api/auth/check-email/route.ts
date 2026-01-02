import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const { users, databases } = createAdminClient();

        // 1. Check if user exists in Appwrite Auth
        const userList = await users.list([Query.equal("email", email)]);

        if (userList.total === 0) {
            return NextResponse.json({ exists: false });
        }

        const user = userList.users[0];

        // 2. Fetch user role from user_meta collection
        // We assume the document ID is the same as the user ID for 1:1 mapping
        try {
            const meta = await databases.getDocument(
                env.APPWRITE_DATABASE_ID,
                env.APPWRITE_USER_META_COLLECTION_ID,
                user.$id
            );

            return NextResponse.json({
                exists: true,
                role: meta.role,
            });
        } catch (error) {
            // If meta doc is missing, something is wrong with data integrity, but for now we can say exists but no role (or handle gracefully)
            console.error("User exists but meta missing:", error);
            return NextResponse.json({ exists: true, role: null });
        }
    } catch (error) {
        console.error("Check email error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
