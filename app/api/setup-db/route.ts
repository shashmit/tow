
import { createAdminClient } from "@/lib/server/appwrite";
import { NextResponse } from "next/server";
import { Permission, Role } from "node-appwrite";

export async function GET() {
    try {
        const { databases } = createAdminClient();
        const dbId = "tow-db";
        const colId = "users";

        // 1. Create Database
        try {
            await databases.get(dbId);
            console.log("Database exists");
        } catch {
            await databases.create(dbId, "Tow Database");
            console.log("Database created");
        }

        // 2. Create Collection
        try {
            await databases.getCollection(dbId, colId);
            console.log("Collection exists");
        } catch {
            await databases.createCollection(dbId, colId, "Users", [
                Permission.read(Role.any()), // Public read for now (or strictly authorized) - maybe Role.users()
                Permission.write(Role.users()), // Authenticated users can write (update their own profile) usually requires document level permissions
                Permission.read(Role.users()),
            ]);
            console.log("Collection created");
        }

        // 3. Create Attributes
        const attributes = [
            { key: "email", type: "string", size: 255, required: true },
            { key: "role", type: "string", size: 50, required: true },
            { key: "name", type: "string", size: 255, required: false },
            { key: "phone", type: "string", size: 50, required: false },
            { key: "age", type: "integer", required: false },
            { key: "isOnboardingComplete", type: "boolean", required: false, default: false },

            // Student Fields
            { key: "grade", type: "string", size: 100, required: false },
            { key: "subjects", type: "string", size: 1000, required: false }, // Store as JSON string or comma-separated

            // Tutor Fields
            { key: "expertise", type: "string", size: 1000, required: false },
            { key: "experience", type: "integer", required: false },
            { key: "bio", type: "string", size: 5000, required: false },
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === "string") {
                    // @ts-ignore
                    await databases.createStringAttribute(dbId, colId, attr.key, attr.size, attr.required, undefined, attr.isArray);
                } else if (attr.type === "integer") {
                    await databases.createIntegerAttribute(dbId, colId, attr.key, attr.required);
                } else if (attr.type === "boolean") {
                    await databases.createBooleanAttribute(dbId, colId, attr.key, attr.required, attr.default);
                }
                console.log(`Attribute ${attr.key} created`);
            } catch (e: any) {
                if (e.code === 409) {
                    console.log(`Attribute ${attr.key} already exists`);
                } else {
                    console.error(`Error creating attribute ${attr.key}:`, e);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Setup DB Error:", error);
        return NextResponse.json({ error: "Failed to setup DB" }, { status: 500 });
    }
}
