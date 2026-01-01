"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { account, databases } from "@/lib/appwrite";
import { Models } from "appwrite";

export default function DashboardPage() {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [userDoc, setUserDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const signOut = async () => {
        await account.deleteSession("current");
        router.push("/login");
    };

    useEffect(() => {
        const init = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);

                const doc = await databases.getDocument(
                    "tow-db",
                    "users",
                    currentUser.$id
                );
                setUserDoc(doc);

                if (!doc.isOnboardingComplete) {
                    router.push("/onboarding");
                }
            } catch (error) {
                console.error("Auth Error:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || !userDoc) return null;

    const role = userDoc?.role || "student"; // Default to student if missing

    return (
        <div className="min-h-screen bg-[#FFFDF8] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center">
                    <h1 className="text-4xl font-black">
                        Welcome, {role === "tutor" ? "Tutor" : "Student"}!
                    </h1>
                    <Button onClick={() => signOut()} variant="outline">Sign Out</Button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-neo">
                        <h3 className="text-xl font-bold mb-2">Profile</h3>
                        <p className="text-gray-600">Email: {user.email}</p>
                        <p className="text-gray-600">Name: {userDoc.name}</p>
                        {role === "student" && <p className="text-gray-600">Grade: {userDoc.grade}</p>}
                        {role === "tutor" && <p className="text-gray-600">Expertise: {userDoc.expertise}</p>}
                    </div>
                    <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-neo md:col-span-2 flex items-center justify-center min-h-[300px]">
                        <p className="text-2xl font-medium text-gray-400">
                            {role === "tutor" ? "Your sessions will appear here." : "Find your next tutor here."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
