"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";

interface DashboardHeaderProps {
    userDoc: any;
    title?: string;
    subtitle?: string;
    hideProfile?: boolean;
}

export function DashboardHeader({ userDoc, title, subtitle, hideProfile }: DashboardHeaderProps) {
    const router = useRouter();

    const signOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        router.push("/login"); // Fixed: using router.push
    };

    const role = userDoc?.role || "student";
    const displayTitle = title || `Welcome back, ${userDoc?.name || 'User'}!`;
    const displaySubtitle = subtitle || (role === "tutor" ? "Manage your tutoring sessions" : "Track your learning journey");

    return (
        <header className="bg-white border-b-2 border-black sticky top-16 md:top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-black">
                            {displayTitle}
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">
                            {displaySubtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {!hideProfile && (
                            <Link href="/dashboard/profile">
                                <div className="w-12 h-12 rounded-full border-2 border-black bg-yellow-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-neo-sm overflow-hidden">
                                    <User className="w-6 h-6 text-black" />
                                </div>
                            </Link>
                        )}
                        <Button
                            onClick={() => signOut()}
                            variant="outline"
                            className="border-2 border-black font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-colors"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
