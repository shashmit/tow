"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter, usePathname } from "next/navigation";
import { PageLoader } from "@/components/ui/page-loader";

// Create a context for the dashboard to share user data
const DashboardContext = createContext<{ userDoc: any } | undefined>(undefined);

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardLayout");
    }
    return context;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userDoc, setUserDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    setUserDoc(data);
                } else {
                    console.warn("Could not fetch profile");
                    // Fallback stub for development/demo
                    setUserDoc({ name: "User", role: "student" });
                }
            } catch (e) {
                console.error(e);
                setUserDoc({ name: "User", role: "student" });
            }
            setLoading(false);
        };

        init();
    }, [router]);

    // Role-based Route Protection
    useEffect(() => {
        if (loading || !userDoc) return;

        const role = userDoc?.role || 'student';

        // Student Restrictions
        if (role === 'student') {
            // Students cannot access Tutor Calendar
            if (pathname.startsWith('/calendar')) {
                router.replace('/dashboard');
            }
        }

        // Tutor Restrictions
        if (role === 'tutor') {
            // Tutors cannot access Book a Session or Browse Tutors (main /tutor page)
            if (pathname.startsWith('/book') || pathname === '/tutor') {
                router.replace('/dashboard');
            }
        }
    }, [loading, userDoc, pathname, router]);

    if (loading) {
        return <PageLoader />;
    }

    // Unified Layout
    const isTutor = userDoc?.role === "tutor";


    // Student Layout
    return (
        <DashboardContext.Provider value={{ userDoc }}>
            <div className="min-h-screen bg-[#FFFDF8]">
                <Sidebar userDoc={userDoc} />

                <div className="pt-20 md:pt-0 md:ml-30 flex flex-col min-h-screen transition-all duration-300">
                    <DashboardHeader
                        userDoc={userDoc}
                        hideProfile={true}
                        title={
                            pathname === "/profile"
                                ? "Edit Profile"
                                : pathname === "/tutor"
                                    ? "Browse Tutor"
                                    : pathname === "/book"
                                        ? "Book a Session"
                                        : undefined
                        }
                        subtitle={
                            pathname === "/profile"
                                ? "Update your personal information"
                                : pathname === "/book"
                                    ? "Select a date to see who is available, then choose a subject and tutor"
                                    : undefined
                        }
                    />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </DashboardContext.Provider>
    );
}
