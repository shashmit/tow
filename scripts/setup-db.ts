
import { Client, Databases, Permission, Role, IndexType } from "node-appwrite";
import "dotenv/config";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const AVAIL_COLLECTION_ID = "tutor_availabilities";
const BOOKING_COLLECTION_ID = "bookings";

async function setupDatabase() {
    console.log("Starting Database Setup...");

    // --- Tutor Availabilities ---
    console.log(`\nSetting up ${AVAIL_COLLECTION_ID}...`);
    try {
        await databases.createCollection(
            DATABASE_ID,
            AVAIL_COLLECTION_ID,
            "Tutor Availabilities",
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        );
        console.log("Collection created.");
    } catch (error: any) {
        if (error.code === 409) console.log("Collection already exists.");
        else console.error("Error creating collection:", error);
    }

    const availAttrs = [
        { key: "tutorId", type: "string", size: 255, required: true },
        { key: "dayOfWeek", type: "string", size: 20, required: true },
        { key: "date", type: "string", size: 20, required: false }, // New Date Field
        { key: "mode", type: "string", size: 20, required: true },
        { key: "slots", type: "string", size: 5000, required: true },
    ];

    for (const attr of availAttrs) {
        try {
            await databases.createStringAttribute(DATABASE_ID, AVAIL_COLLECTION_ID, attr.key, attr.size, attr.required);
            console.log(`Attribute ${attr.key} created.`);
        } catch (error: any) {
            if (error.code === 409) console.log(`Attribute ${attr.key} exists.`);
            else console.error(`Error creating attribute ${attr.key}:`, error);
        }
    }

    // Indexes
    try {
        await databases.createIndex(DATABASE_ID, AVAIL_COLLECTION_ID, "idx_tutor_date", IndexType.Unique, ["tutorId", "date"]);
        console.log("Index idx_tutor_date created.");
    } catch (e: any) {
        if (e.code === 409) console.log("Index idx_tutor_date exists.");
        else console.error("Error creating index idx_tutor_date:", e);
    }


    // --- Bookings ---
    console.log(`\nSetting up ${BOOKING_COLLECTION_ID}...`);
    try {
        await databases.createCollection(
            DATABASE_ID,
            BOOKING_COLLECTION_ID,
            "Bookings",
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()), // Maybe strict?
                Permission.delete(Role.users()),
            ]
        );
        console.log("Collection created.");
    } catch (error: any) {
        if (error.code === 409) console.log("Collection already exists.");
        else console.error("Error creating collection:", error);
    }

    const bookingAttrs = [
        { key: "studentId", type: "string", size: 255, required: true },
        { key: "tutorId", type: "string", size: 255, required: true },
        { key: "date", type: "string", size: 20, required: true }, // YYYY-MM-DD
        { key: "startTime", type: "string", size: 20, required: true },
        { key: "endTime", type: "string", size: 20, required: true },
        { key: "type", type: "string", size: 20, required: true }, // online/offline
        { key: "status", type: "string", size: 20, required: true }, // confirmed, cancelled
        { key: "createdAt", type: "string", size: 50, required: false },
    ];

    for (const attr of bookingAttrs) {
        try {
            await databases.createStringAttribute(DATABASE_ID, BOOKING_COLLECTION_ID, attr.key, attr.size, attr.required);
            console.log(`Attribute ${attr.key} created.`);
        } catch (error: any) {
            if (error.code === 409) console.log(`Attribute ${attr.key} exists.`);
            else console.error(`Error creating attribute ${attr.key}:`, error);
        }
    }

    try {
        await databases.createIndex(DATABASE_ID, BOOKING_COLLECTION_ID, "idx_student", IndexType.Key, ["studentId"]);
        await databases.createIndex(DATABASE_ID, BOOKING_COLLECTION_ID, "idx_tutor", IndexType.Key, ["tutorId"]);
        console.log("Indexes created.");
    } catch (e: any) {
        console.log("Indexes check skipped/error (likely exist).");
    }

    console.log("\nSetup complete!");
}

setupDatabase();
