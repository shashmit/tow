"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${isScrolled
                ? "top-14 w-[90%] max-w-4xl"
                : "top-16 w-[95%] max-w-7xl"
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut", delay: 0.5 }}
        >
            <div
                className={`flex items-center justify-between px-8 py-4 rounded-full transition-all duration-300 ${isScrolled
                    ? "bg-white border-2 border-black shadow-neo"
                    : "bg-transparent border-transparent shadow-none backdrop-blur-sm"
                    }`}
            >

                {/* Logo */}
                <Link href="/" className="font-serif text-2xl font-black text-black tracking-tight hover:underline decoration-4 underline-offset-4 shrink-0">
                    Tow.
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    {["Philosophy", "Mentors", "Pricing"].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-md border-2 border-transparent transition-all ${isScrolled
                                ? "text-black hover:bg-yellow-200 hover:border-black"
                                : "text-black hover:bg-white/50"
                                }`}
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link href="/login">
                        <Button size="sm" className={`rounded-full h-10 px-6 text-xs font-bold uppercase tracking-wide border-2 border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${isScrolled
                            ? "bg-black text-white hover:bg-emerald-400 hover:text-black"
                            : "bg-white text-black hover:bg-black hover:text-white"
                            }`}>
                            Start
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
