import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
    gender: z.string(),
    phoneNumber: z.string().min(5),
    location: z.string().min(2),
    bio: z.string().max(5000),
    // Tutor specific
    experience: z.string().optional(),
    qualification: z.string().optional(),
    educationMode: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.enum(["hybrid", "physical", "online"]).optional()
    ),
    // Student specific
    learningMode: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.enum(["hybrid", "physical", "online"]).optional()
    ),
    subjects: z.array(z.string()).optional(),
    classLevels: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { databases } = createAdminClient();

        const userDoc = await databases.getDocument(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_META_COLLECTION_ID,
            userId
        );

        const role = request.headers.get("x-user-role") || "student";

        return NextResponse.json({ ...userDoc, role });
    } catch (error: any) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = request.headers.get("x-user-id");
        const role = request.headers.get("x-user-role");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const data = profileSchema.parse(body);

        const { databases } = createAdminClient();

        await databases.updateDocument(
            env.APPWRITE_DATABASE_ID,
            env.APPWRITE_USER_META_COLLECTION_ID,
            userId,
            {
                name: data.name,
                age: data.age,
                gender: data.gender,
                phone: data.phoneNumber,
                location: data.location,
                bio: data.bio,
                ...(role === 'tutor' ? {
                    experience: data.experience,
                    qualification: data.qualification,
                    educationMode: data.educationMode
                } : {
                    learningMode: data.learningMode
                }),
                subjects: data.subjects || [],
                classLevels: data.classLevels || [],
                imageUrl: data.imageUrl,
            }
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
