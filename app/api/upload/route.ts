import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { env } from "@/lib/env";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Convert File to buffer for node-appwrite
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { storage } = createAdminClient();

        // Create an InputFile from the buffer
        const inputFile = InputFile.fromBuffer(buffer, file.name);

        // Upload to Appwrite storage
        const result = await storage.createFile(
            env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
            ID.unique(),
            inputFile
        );

        // Construct the file URL for immediate use
        const fileUrl = `${env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${result.$id}/view?project=${env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

        return NextResponse.json({ ...result, fileUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "Failed to upload file", details: error.message },
            { status: 500 }
        );
    }
}
