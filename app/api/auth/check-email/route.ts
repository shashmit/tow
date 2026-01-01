import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const { account } = createAdminClient();

        // List users with this email
        const users = await account.list([
            Query.equal('email', email)
        ]);

        const user = users.users[0];

        return NextResponse.json({
            exists: users.total > 0,
            role: user ? user.prefs.role : null
        });

    } catch (error) {
        console.error("Check email error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
