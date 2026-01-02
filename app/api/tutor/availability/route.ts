
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";
import { ID, Query, Models } from "node-appwrite";
import { z } from "zod";

const COLLECTION_ID = "tutor_availabilities";

// Validation Schemas
const SlotSchema = z.object({
    start: z.string(), // ISO time or HH:mm
    type: z.enum(["online", "offline"]),
});

const DayScheduleSchema = z.object({
    dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
    mode: z.enum(["online", "offline", "hybrid", "half", "close"]),
    slots: z.array(SlotSchema),
});

const UpdateAvailabilitySchema = z.object({
    schedule: z.array(DayScheduleSchema),
});

type Slot = z.infer<typeof SlotSchema>;

export async function GET(req: NextRequest) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        const role = headersList.get("x-user-role");

        const { searchParams } = new URL(req.url);
        const queryTutorId = searchParams.get("tutorId");

        // Initialize databases client
        const { databases } = createAdminClient();

        let targetTutorId: string = userId || "";

        // If a specific tutor is requested (e.g., by a student), use that ID
        if (queryTutorId) {
            targetTutorId = queryTutorId;
        } else {
            // Default to self (tutor dashboard case)
            if (!userId || role !== "tutor") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        if (!targetTutorId) {
            return NextResponse.json({ error: "Tutor ID required" }, { status: 400 });
        }

        // Fetch User Meta to get educationMode
        let educationMode = "hybrid"; // Default fallback
        try {
            const userMeta = await databases.getDocument(
                env.APPWRITE_DATABASE_ID,
                env.APPWRITE_USER_META_COLLECTION_ID,
                targetTutorId
            );
            educationMode = userMeta.educationMode || "hybrid";
        } catch (e) {
            console.warn("Could not fetch user meta for availability", e);
        }

        const response = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal("tutorId", targetTutorId),
                Query.limit(7),
                Query.orderAsc("date") // Ensure we get ordered dates
            ]
        );

        // Parse slots string back to JSON
        const schedule = response.documents.map((doc: any) => ({
            ...doc,
            slots: JSON.parse(doc.slots),
        }));

        return NextResponse.json({ schedule, educationMode });
    } catch (error: unknown) {
        console.error("Error fetching availability:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        const role = headersList.get("x-user-role");

        if (!userId || role !== "tutor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = UpdateAvailabilitySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request body", details: result.error.issues }, { status: 400 });
        }

        const { schedule: weeklyTemplate } = result.data;
        const { databases } = createAdminClient();

        // VALIDATION LOGIC (Basic check on template)
        // ... (Keep existing validation if needed, or simplify)

        const savedDocs = [];
        const today = new Date();

        // Generate for next 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            const dayOfWeekName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const templateDay = weeklyTemplate.find((d: any) => d.dayOfWeek === dayOfWeekName);

            if (!templateDay) continue; // Should ideally have all days in template, but safety check

            // Check if document exists for this DATE
            // Note: Schema must support 'date' field query. 
            // If 'date' index is missing, this might be slow or fail if not configured.
            // fallback: assuming schema update mentioned in plan is done.
            const existing = await databases.listDocuments(
                env.APPWRITE_DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal("tutorId", userId),
                    Query.equal("date", dateStr) // Changed from dayOfWeek to date
                ]
            );

            // Construct slots
            // If updating, we might want to preserve "booked" status if the slot start time matches?
            // For now, naive overwrite of slots or merge.
            // Merge Strategy: If existing doc has slots with booked=true, keep them if they exist in new template.
            let finalSlots = templateDay.slots.map((s: Slot) => ({ ...s, booked: false }));

            if (existing.total > 0) {
                const oldSlots = JSON.parse(existing.documents[0].slots);
                finalSlots = finalSlots.map((newSlot: any) => {
                    const matchingOld = oldSlots.find((old: any) => old.start === newSlot.start && old.type === newSlot.type);
                    if (matchingOld && matchingOld.booked) {
                        return { ...newSlot, booked: true };
                    }
                    return newSlot;
                });
            }

            const docData = {
                tutorId: userId,
                dayOfWeek: dayOfWeekName, // Keep for backward comp or reference
                date: dateStr, // NEW FIELD
                mode: templateDay.mode,
                slots: JSON.stringify(finalSlots),
            };

            if (existing.total > 0) {
                const docId = existing.documents[0].$id;
                const updated = await databases.updateDocument(
                    env.APPWRITE_DATABASE_ID,
                    COLLECTION_ID,
                    docId,
                    docData
                );
                savedDocs.push(updated);
            } else {
                const created = await databases.createDocument(
                    env.APPWRITE_DATABASE_ID,
                    COLLECTION_ID,
                    ID.unique(),
                    docData
                );
                savedDocs.push(created);
            }
        }

        return NextResponse.json({ success: true, saved: savedDocs.length });

    } catch (error: any) {
        console.error("Error saving availability:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
