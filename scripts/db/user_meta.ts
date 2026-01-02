import { Client, Databases, Permission, Role } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DB_ID = process.env.APPWRITE_DATABASE_ID; // Optional in env, can be created

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
    console.error("❌ Missing required Appwrite credentials in .env (ENDPOINT, PROJECT_ID, API_KEY)");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function setup() {
    let dbId = DB_ID;
    let collectionId = "";

    // 1. Setup Database
    if (!dbId) {
        console.log("Creating Database 'tow_db'...");
        try {
            const db = await databases.create("tow_db", "tow_db");
            dbId = db.$id;
            console.log(`✅ Database created: ${dbId}`);
        } catch (err: any) {
            if (err.code === 409) {
                console.log("ℹ️ Database 'tow_db' already exists, using it.");
                dbId = "tow_db";
            } else {
                throw err;
            }
        }
    }

    // 2. Setup Collection
    const colName = "user_meta";
    const userMetaId = collectionId || "user_meta";

    console.log(`Setting up collection '${colName}' in DB '${dbId}'...`);

    try {
        // Try to get to see if exists
        await databases.getCollection(dbId!, userMetaId);
        console.log(`ℹ️ Collection '${userMetaId}' already exists.`);
        collectionId = userMetaId;
    } catch (err: any) {
        if (err.code === 404) {
            const col = await databases.createCollection(
                dbId!,
                userMetaId,
                colName,
                [
                    Permission.read(Role.any()), // Adjust according to strict security if needed
                    Permission.read(Role.users()),
                    // Only admins/server should write to this usually, or specific users
                    // backend uses API Key so permissions here are for frontend access if any
                ]
            );
            collectionId = col.$id;
            console.log(`✅ Collection created: ${collectionId}`);
        } else {
            throw err;
        }
    }

    // 3. Setup Attributes
    console.log("Ensuring attributes...");

    const ensureAttr = async (createFn: () => Promise<any>, name: string) => {
        try {
            await createFn();
            console.log(`✅ Attribute '${name}' created.`);
        } catch (err: any) {
            if (err.code === 409) {
                console.log(`ℹ️ Attribute '${name}' already exists.`);
            } else {
                console.error(`❌ Failed to create attribute '${name}':`, err.message);
            }
        }
    };

    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "email", 255, true),
        "email"
    );

    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "role", 50, true),
        "role"
    );

    await ensureAttr(
        () => databases.createBooleanAttribute(dbId!, collectionId!, "onboardingCompleted", true),
        "onboardingCompleted"
    );

    // New Onboarding Attributes
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "name", 255, false),
        "name"
    );
    await ensureAttr(
        () => databases.createIntegerAttribute(dbId!, collectionId!, "age", false),
        "age"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "gender", 50, false),
        "gender"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "phone", 50, false),
        "phone"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "location", 255, false), // City, Country
        "location"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "bio", 5000, false),
        "bio"
    );

    // Tutor Specific (Optional/Nullable)
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "experience", 255, false),
        "experience"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "educationMode", 50, false),
        "educationMode"
    );
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "qualification", 255, false),
        "qualification"
    );

    // Student Specific (Optional/Nullable)
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "learningMode", 50, false),
        "learningMode"
    );

    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "subjects", 100, false, undefined, true), // Array
        "subjects"
    );

    // Class Levels - for both students (class they're in) and tutors (classes they teach)
    await ensureAttr(
        () => databases.createStringAttribute(dbId!, collectionId!, "classLevels", 50, false, undefined, true), // Array
        "classLevels"
    );

    // Wait a bit for indexing? properties usually ready quickly but indexing takes time.
    // Attributes are async in Appwrite.

    console.log("\n---------------------------------------------------");
    console.log("✅ Appwrite Setup Complete");
    console.log("---------------------------------------------------");
    console.log(`DATABASE_ID=${dbId}`);
    console.log(`COLLECTION_ID=${collectionId}`);
    console.log("---------------------------------------------------");
    console.log("👉 Please ensure these IDs are in your .env file!");
}

setup().catch(console.error);
