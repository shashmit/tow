"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function PreFooterCTA() {
    return (
        <section className="py-20 bg-emerald-50 border-t-2 border-black">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto space-y-8"
                >
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-black leading-tight">
                        Ready to start your journey?
                    </h2>
                    <p className="text-lg text-black/80 max-w-2xl mx-auto">
                        Whether in-person or online, find the perfect tutor to help you achieve your goals today.
                    </p>

                    <Button
                        size="lg"
                        className="rounded-full px-12 h-16 text-lg bg-black text-white border-2 border-black hover:bg-white hover:text-black hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] shadow-neo transition-all duration-200"
                    >
                        Find your tutor
                        <MapPin className="ml-3 w-5 h-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
