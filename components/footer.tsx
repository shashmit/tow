"use client";

import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-white py-20 border-t-2 border-black">
            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">

                <Link href="/" className="font-serif text-4xl font-black tracking-tight text-black mb-8 hover:underline decoration-4 underline-offset-4">
                    <span className="text-yellow-400">.</span>Tow<span className="text-purple-400">.</span>
                </Link>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {["Philosophy", "Mentors", "Pricing", "Contact"].map((item) => (
                        <Link key={item} href="#" className="text-black font-bold uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-black hover:bg-yellow-200 rounded transition-all">
                            {item}
                        </Link>
                    ))}
                </div>

                <p className="text-xs text-black font-bold uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full border border-black">
                    &copy; 2024 Tow Education.
                </p>

            </div>
        </footer>
    );
}
