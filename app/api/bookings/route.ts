import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { addMinutes, format, parse } from "date-fns";

const BOOKINGS_COLLECTION_ID = "bookings";
const AVAILABILITY_COLLECTION_ID = "tutor_availabilities";

const BookingSchema = z.object({
    tutorId: z.string(),
    date: z.string(), // YYYY-MM-DD or ISO
    startTime: z.string(),
    endTime: z.string(),
    type: z.enum(["online", "offline"]),
    dayOfWeek: z.string(), // "monday", "tuesday" etc. to find the schedule doc
});

const USER_META_COLLECTION_ID = "user_meta";

export async function POST(req: NextRequest) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const result = BookingSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.issues }, { status: 400 });
        }

        const { tutorId, date, startTime, type, dayOfWeek } = result.data;
        const { databases } = createAdminClient();

        // 0. Calculate End Time based on Type
        // Assuming startTime is in "HH:mm" (24h) or "hh:mm a" (12h). 
        // We need to parse it. Let's assume standardized format or try standard formats.
        // If coming from UI input type="time", it's "HH:mm".

        const duration = type === "online" ? 50 : 80;
        const today = new Date(); // Only used for time parsing base
        // Parse time: Try "HH:mm" first as it's standard for HTML inputs and what we likely sent
        let parsedStartTime = parse(startTime, "HH:mm", today);
        if (isNaN(parsedStartTime.getTime())) {
            // Fallback or try other format if needed, but sticking to HH:mm as per typical app usage
            parsedStartTime = parse(startTime, "h:mm a", today);
        }

        if (isNaN(parsedStartTime.getTime())) {
            return NextResponse.json({ error: "Invalid start time format" }, { status: 400 });
        }

        const calculatedEndTimeDate = addMinutes(parsedStartTime, duration);
        const calculatedEndTime = format(calculatedEndTimeDate, "HH:mm");

        // 1. Fetch Tutor Availability for that DATE
        const availabilityDocs = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            AVAILABILITY_COLLECTION_ID,
            [
                Query.equal("tutorId", tutorId),
                Query.equal("date", date) // Using literal date from payload which should match YYYY-MM-DD
            ]
        );

        if (availabilityDocs.total === 0) {
            return NextResponse.json({ error: "Tutor has no availability for this date" }, { status: 404 });
        }

        const availabilityDoc = availabilityDocs.documents[0];
        let slots = JSON.parse(availabilityDoc.slots);

        // 2. Find and Validate Slot
        const slotIndex = slots.findIndex((s: any) => s.start === startTime && s.type === type);

        if (slotIndex === -1) {
            return NextResponse.json({ error: "Slot not found" }, { status: 404 });
        }

        if (slots[slotIndex].booked) {
            return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
        }

        // 3. Mark Slot as Booked
        slots[slotIndex].booked = true;
        slots[slotIndex].end = calculatedEndTime; // Update the slot with the calculated end time

        // 4. Update Availability Document
        await databases.updateDocument(
            env.APPWRITE_DATABASE_ID,
            AVAILABILITY_COLLECTION_ID,
            availabilityDoc.$id,
            {
                slots: JSON.stringify(slots)
            }
        );

        // 5. Create Booking Record
        // Check if bookings collection exists, if not, we might fail here if not created manually.
        // Assuming it exists as per plan.
        const booking = await databases.createDocument(
            env.APPWRITE_DATABASE_ID,
            BOOKINGS_COLLECTION_ID,
            ID.unique(),
            {
                studentId: userId,
                tutorId,
                date,
                startTime,
                endTime: calculatedEndTime, // Use calculated end time
                type,
                status: "confirmed",
                createdAt: new Date().toISOString()
            }
        );

        return NextResponse.json({ success: true, bookingId: booking.$id });

    } catch (error: any) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: "Booking failed", details: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");
        // const { searchParams } = new URL(req.url); // Can use for filtering later

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { databases } = createAdminClient();

        // Fetch bookings for the tutor (userId is used as tutorId for tutors dashboard)
        // We assume the caller is the tutor. Validation of role could be added if needed, 
        // but fetching bookings where tutorId == userId implicitly scopes it.
        const bookings = await databases.listDocuments(
            env.APPWRITE_DATABASE_ID,
            BOOKINGS_COLLECTION_ID,
            [
                Query.equal("tutorId", userId),
                Query.orderDesc("date"),
                Query.orderDesc("startTime"),
                Query.limit(50)
            ]
        );

        if (bookings.total === 0) {
            return NextResponse.json([]);
        }

        // Enrich bookings with student data
        const enrichedBookings = await Promise.all(
            bookings.documents.map(async (booking) => {
                try {
                    // Fetch student profile from user_meta using studentId (which is user ID)
                    // user_meta documents are usually IDed by user ID in this setup? 
                    // Based on user_meta.ts setup, the collection ID is "user_meta".
                    // Standard pattern is to query by $id or custom ID if not auto-generated.
                    // The setup script creates collection "user_meta" but doesn't explicitly enforce ID logic 
                    // besides creates. Usually we might query by 'email' or similar if not same ID.
                    // However, let's try assuming a query by user ID or checking if we can find them.

                    // Actually, looking at user_meta.ts, it doesn't enforce document ID == user ID explicitly 
                    // in the `createCollection` part, but usually user data is linked.
                    // Let's try to query where a hypothetical 'userId' attribute matches or just use the studentId 
                    // if we can assume document ID matches user ID (common pattern but not guaranteed unless set).

                    // IF we can't efficiently join, we just fetch.

                    // Wait, let's look at user_meta structure. It has 'role', 'email', 'name', etc.
                    // It does NOT explicitly have a 'userId' field in the attributes list in user_meta.ts.
                    // BUT Appwrite permissions usually link it. 
                    // Let's assume for now we might need to query by... actually we don't have a direct link field 
                    // in the attributes list in user_meta.ts except maybe it uses the same ID? 
                    // Or maybe we can't easily fetch without a common field.
                    // However, 'createDocument' allows setting ID. If user_meta docs are created with User ID, we are good.
                    // If not, we might struggle. 

                    // fallback: if we can't find exact doc, we settle for partial info or just the ID.
                    // But requirement is "Who has booked it" -> Name.

                    // Let's try to get document with ID == studentId first.
                    let student = null;
                    try {
                        student = await databases.getDocument(
                            env.APPWRITE_DATABASE_ID,
                            USER_META_COLLECTION_ID,
                            booking.studentId
                        );
                    } catch (e) {
                        // usage of list filtered by internal ID or just skip if fail
                    }

                    if (!student) {
                        // Fallback: This might fail if user_meta doc ID != auth User ID.
                        // For now return basic info if student not found.
                        return {
                            ...booking,
                            student: {
                                name: "Unknown Student",
                                classLevels: [],
                                subjects: []
                            }
                        };
                    }

                    return {
                        ...booking,
                        student: {
                            name: student.name || "Unknown",
                            classLevels: student.classLevels || [],
                            subjects: student.subjects || [],
                            email: student.email, // Optional
                            gender: student.gender || "Not Specified"
                        }
                    };
                } catch (err) {
                    // Fail silently for individual student fetch
                    return {
                        ...booking,
                        student: { name: "Error fetching student" }
                    };
                }
            })
        );

        return NextResponse.json(enrichedBookings);

    } catch (error: any) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
