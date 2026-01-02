"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/client";

interface StudentNavbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export function StudentNavbar({
    searchQuery,
    setSearchQuery,
    mobileMenuOpen,
    setMobileMenuOpen,
}: StudentNavbarProps) {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#FFFDF8] border-b-2 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Links */}
                    <div className="flex items-center">
                        <Link
                            href="/dashboard/student"
                            className="flex-shrink-0 flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg border-2 border-black">
                                T
                            </div>
                            <span className="font-serif font-black text-xl tracking-tight">
                                TutorMarket
                            </span>
                        </Link>
                        <div className="hidden md:ml-8 md:flex md:space-x-4">
                            <Link
                                href="/dashboard/student/tutors"
                                className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-black bg-yellow-200 text-black"
                            >
                                Find Tutors
                            </Link>
                            <Link
                                href="#"
                                className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border-2 border-transparent text-gray-600 hover:border-black hover:bg-white transition-all"
                            >
                                My Sessions
                            </Link>
                        </div>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Search */}
                        <div className="hidden md:block relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tutors..."
                                className="block w-64 pl-10 pr-3 py-2 border-2 border-black rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="p-2 rounded-lg border-2 border-black text-black hover:bg-yellow-200 focus:outline-none md:hidden transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search (shown when menu is open) */}
            {mobileMenuOpen && (
                <div className="block md:hidden px-4 pb-4 border-t-2 border-black bg-white">
                    <div className="relative mt-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            className="block w-full pl-10 pr-3 py-2 border-2 border-black rounded-xl bg-white placeholder-gray-400 focus:outline-none text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                        <Link
                            href="/dashboard/student/tutors"
                            className="text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-lg border-2 border-black bg-yellow-200 text-black text-center"
                        >
                            Find Tutors
                        </Link>
                        <Link
                            href="#"
                            className="text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-lg border-2 border-black text-black text-center"
                        >
                            My Sessions
                        </Link>
                        <Button variant="outline" onClick={handleSignOut} className="mt-2">
                            Sign Out
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
