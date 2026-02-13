import { Client, Storage } from "appwrite";
import { envClient } from "@/lib/env-client";

const client = new Client()
    .setEndpoint(envClient.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(envClient.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export async function uploadFile(file: File) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload API Error:", errorText);
            throw new Error(`Failed to upload file: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
}

