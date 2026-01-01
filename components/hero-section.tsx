"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, MapPin, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef } from "react";

export function HeroSection() {
    return (
        <section className="relative min-h-[110vh] bg-orange-50/50 flex flex-col items-center pt-36 pb-20 px-4 md:px-8 overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.1]" />

            {/* Card Stack Container */}
            <div className="relative w-full max-w-5xl flex flex-col items-center">

                {/* Card 1: Visual/Image (Back Layer) */}
                <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-[2.5rem] border-2 border-black/80 shadow-neo bg-white overflow-hidden z-0">
                    <Image
                        src="/hybrid-hero.png"
                        alt="Hybrid Tutoring: Online and In-Person"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Floating Tags for Image Card */}
                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur border-2 border-black px-4 py-2 rounded-lg shadow-neo-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500 fill-red-500" />
                        <span className="text-xs font-bold uppercase tracking-wide">At your home</span>
                    </div>
                    <div className="absolute top-8 right-8 bg-black/90 backdrop-blur text-white px-4 py-2 rounded-lg border-2 border-black shadow-neo-sm flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold uppercase tracking-wide">Or anywhere else</span>
                    </div>
                </div>

                {/* Card 2: Content (Front Layer) */}
                {/* Static Overlap: Negative margin pulls it up.
              Image Aspect 16/9 = 56.25% height ratio.
              Target Overlap 40% of height = 0.4 * 56.25% ≈ 22.5% of width.
              We use -mt-[22%] to achieve roughly 40% overlap of the Image Card. 
          */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative -mt-[25%] w-full max-w-4xl bg-white rounded-[2.5rem] border-2 border-black shadow-neo-lg p-8 md:p-12 z-20 flex flex-col items-center text-center gap-6"
                >
                    {/* Headline */}
                    <h1 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] leading-[0.9] text-black">
                        <span>Local Roots.</span>
                        <span className="block mt-2 italic font-light text-black bg-emerald-200 px-4 border-2 border-black shadow-neo transform rotate-1">
                            Global Reach.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-black/80 font-medium leading-relaxed max-w-lg">
                        The world's first <strong>Hybrid Marketplace</strong>. Get a tutor to come to your home for deep-focus sessions, or connect with a global expert online. The choice is yours.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center mt-2">
                        <Button
                            size="lg"
                            className="rounded-full px-8 h-14 text-base bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] shadow-neo transition-all duration-200"
                        >
                            Find your tutor
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
