import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite/server";
import { signSessionJWT } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

// Schema for validation
const onboardingSchema = z.object({
    name: z.string().min(2),
    age: z.number().int().positive(),
    gender: z.string(),
    phoneNumber: z.string().min(5),
    location: z.string().min(2),
    bio: z.string().max(5000),
    // Tutor specific
    experience: z.string().optional(),
    qualification: z.string().optional(),
    educationMode: z.enum(["hybrid", "physical", "online"]).optional(),
    // Student specific
    learningMode: z.enum(["hybrid", "physical", "online"]).optional(),
    subjects: z.array(z.string()).optional(),
    // We'll enforce logic in frontend, but backend accepts array.
    classLevels: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Get User Info from Headers (set by middleware)
        const userId = request.headers.get("x-user-id");
        const roleHeader = request.headers.get("x-user-role");

        if (!userId || !roleHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Validate Body
        const data = onboardingSchema.parse(body);

        // 3. Update user_meta
        const { databases } = createAdminClient();

        // Use userId as document ID
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
                // Only update relevant fields
                ...(roleHeader === 'tutor' ? {
                    experience: data.experience,
                    qualification: data.qualification,
                    educationMode: data.educationMode
                } : {
                    learningMode: data.learningMode
                }),
                subjects: data.subjects || [],
                classLevels: data.classLevels || [],
                onboardingCompleted: true
            }
        );

        // 4. Issue Session JWT
        const sessionToken = await signSessionJWT({ userId, role: roleHeader, onboardingCompleted: true });

        // Set HTTP-only cookie
        (await cookies()).set("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({
            success: true,
            token: sessionToken,
        });

    } catch (error: any) {
        console.error("Onboarding Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: "failed to validate onboarding data" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
