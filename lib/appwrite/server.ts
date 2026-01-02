import { Client, Databases, Users } from "node-appwrite";
import { env } from "@/lib/env";

export function createAdminClient() {
    const client = new Client()
        .setEndpoint(env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(env.APPWRITE_API_KEY);

    return {
        get users() {
            return new Users(client);
        },
        get databases() {
            return new Databases(client);
        },
    };
}
