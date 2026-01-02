import { Client, Databases, Permission, Role, Query, IndexType } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DB_ID = process.env.APPWRITE_DATABASE_ID!;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID) {
    console.error("❌ Missing required Appwrite credentials in .env");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// Predefined subjects
const SUBJECTS = [
    { name: "Mathematics", slug: "math", category: null, description: "Core mathematics including algebra, geometry, calculus" },
    { name: "Physics", slug: "physics", category: null, description: "Study of matter, energy, and their interactions" },
    { name: "Chemistry - Inorganic", slug: "chemistry-inorganic", category: "chemistry", description: "Study of inorganic compounds and their properties" },
    { name: "Chemistry - Organic", slug: "chemistry-organic", category: "chemistry", description: "Study of carbon-based compounds" },
    { name: "Chemistry - Physical", slug: "chemistry-physical", category: "chemistry", description: "Study of physical principles underlying chemical systems" },
    { name: "Chemistry - Complete", slug: "chemistry-complete", category: "chemistry", description: "Comprehensive chemistry covering all branches" },
];

const COLLECTION_ID = "subjects";

async function setup() {
    console.log("Setting up 'subjects' collection...\n");

    // 1. Create Collection
    try {
        await databases.getCollection(DB_ID, COLLECTION_ID);
        console.log(`ℹ️ Collection '${COLLECTION_ID}' already exists.`);
    } catch (err: any) {
        if (err.code === 404) {
            await databases.createCollection(
                DB_ID,
                COLLECTION_ID,
                "subjects",
                [
                    Permission.read(Role.any()),
                    Permission.read(Role.users()),
                ]
            );
            console.log(`✅ Collection '${COLLECTION_ID}' created.`);
        } else {
            throw err;
        }
    }

    // 2. Create Attributes
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
        () => databases.createStringAttribute(DB_ID, COLLECTION_ID, "name", 255, true),
        "name"
    );

    await ensureAttr(
        () => databases.createStringAttribute(DB_ID, COLLECTION_ID, "slug", 100, true),
        "slug"
    );

    await ensureAttr(
        () => databases.createStringAttribute(DB_ID, COLLECTION_ID, "category", 100, false),
        "category"
    );

    await ensureAttr(
        () => databases.createStringAttribute(DB_ID, COLLECTION_ID, "description", 500, false),
        "description"
    );

    // Wait for attributes to be ready
    console.log("\n⏳ Waiting for attributes to be indexed...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. Create unique index on slug
    try {
        await databases.createIndex(DB_ID, COLLECTION_ID, "idx_slug", IndexType.Unique, ["slug"]);
        console.log("✅ Unique index on 'slug' created.");
    } catch (err: any) {
        if (err.code === 409) {
            console.log("ℹ️ Index 'idx_slug' already exists.");
        } else {
            console.error("❌ Failed to create index:", err.message);
        }
    }

    // 4. Seed subjects
    console.log("\n📝 Seeding subjects...");

    for (const subject of SUBJECTS) {
        try {
            // Check if subject already exists by slug
            const existing = await databases.listDocuments(DB_ID, COLLECTION_ID, [
                Query.equal("slug", subject.slug)
            ]);

            if (existing.total > 0) {
                console.log(`ℹ️ Subject '${subject.name}' already exists.`);
                continue;
            }

            await databases.createDocument(
                DB_ID,
                COLLECTION_ID,
                subject.slug, // Use slug as document ID
                {
                    name: subject.name,
                    slug: subject.slug,
                    category: subject.category,
                    description: subject.description,
                },
                [
                    Permission.read(Role.any()),
                ]
            );
            console.log(`✅ Subject '${subject.name}' created.`);
        } catch (err: any) {
            console.error(`❌ Failed to create subject '${subject.name}':`, err.message);
        }
    }

    console.log("\n---------------------------------------------------");
    console.log("✅ Subjects Setup Complete");
    console.log("---------------------------------------------------");
    console.log(`SUBJECTS_COLLECTION_ID=${COLLECTION_ID}`);
    console.log("---------------------------------------------------");
}

setup().catch(console.error);
