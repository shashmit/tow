import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1),
    APPWRITE_API_KEY: z.string().min(1),
    APPWRITE_DATABASE_ID: z.string().min(1),
    APPWRITE_USER_META_COLLECTION_ID: z.string().min(1),
    JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse({
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
    APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
    APPWRITE_USER_META_COLLECTION_ID: process.env.APPWRITE_USER_META_COLLECTION_ID,
    JWT_SECRET: process.env.JWT_SECRET,
});
