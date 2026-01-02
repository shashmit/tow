"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Users, User, Calendar } from "lucide-react";

interface SidebarProps {
    userDoc: any;
}

export function Sidebar({ userDoc }: SidebarProps) {
    const pathname = usePathname();

    const userRole = userDoc?.role || 'student';

    const navItems = [
        {
            label: "Progress",
            href: "/dashboard",
            icon: TrendingUp,
            allowedRoles: ['student', 'tutor'],
        },
        {
            label: "Book a Session",
            href: "/book",
            icon: Calendar,
            allowedRoles: ['student'],
        },
        {
            label: "Tutors",
            href: "/tutor",
            icon: Users,
            allowedRoles: ['student'],
        },
        {
            href: "/profile",
            label: "Profile",
            icon: User,
            allowedRoles: ['student', 'tutor'],
        },
        {
            label: "Calendar",
            href: "/calendar",
            icon: Calendar,
            allowedRoles: ['tutor'],
        },
    ].filter(item => item.allowedRoles.includes(userRole));

    return (
        <aside className="fixed top-0 left-0 w-full md:w-32 z-50 bg-white border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-row md:flex-col md:inset-y-0 h-auto md:h-full">
            {/* Logo Area */}
            <div className="flex flex-col border-r-2 md:border-r-0 md:border-b-2 border-black">
                <div className="h-16 md:h-[116px] flex items-center justify-center px-4 md:p-6 bg-white w-20 md:w-auto">
                    <h1 className="font-serif text-xl md:text-3xl font-black text-black tracking-tight hover:underline decoration-4 underline-offset-4 shrink-0">
                        Tow.
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-y-auto items-center md:items-stretch">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-center md:flex-col gap-1 md:gap-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 transition-all
                                h-auto md:aspect-[4/3] px-4 py-2 md:p-0
                                ${isActive
                                    ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                                    : "bg-white text-black border-black hover:bg-yellow-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                                }`}
                        >
                            <item.icon className="w-4 h-4 md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                            <span className="font-black uppercase tracking-widest text-[10px] md:text-xs hidden md:block text-center leading-tight">{item.label}</span>
                            <span className="font-black uppercase tracking-widest text-[10px] md:text-xs block md:hidden">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

        </aside>
    );
}
