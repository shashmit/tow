"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Marquee() {
    return (
        <div className="fixed top-0 left-0 w-full h-10 bg-yellow-300 border-b-2 border-black z-[60] overflow-hidden flex items-center">
            <motion.div
                className="flex gap-8 items-center whitespace-nowrap"
                animate={{ x: "-50%" }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20,
                }}
                initial={{ x: "0%" }}
            >
                {/* Repeat content enough times to fill screen and loop smoothly */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black">
                        <span>Accepting students and tutor</span>
                        <Star className="w-3 h-3 fill-black text-black" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
