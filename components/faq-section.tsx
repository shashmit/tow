"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const faqs = [
        {
            question: "How does the 'Concierge' model work?",
            answer: "Unlike standard marketplaces where you scroll through hundreds of profiles, we do the heavy lifting. We analyze your learning style and goals, then hand-pick the perfect mentor from our elite network."
        },
        {
            question: "What if I don't click with my tutor?",
            answer: "Chemistry is everything. That's why we offer a 'Chemistry Guarantee'. If the first session isn't a perfect fit, we'll rematch you immediately at no extra cost to ensure you have the right partner."
        },
        {
            question: "Is Tow available for university students?",
            answer: "Absolutely. We specialize in K-12, A-Levels, IB, and University-level mentorship. Many of our mentors are PhD candidates or industry professionals perfect for advanced guidance."
        },
        {
            question: "Do you offer online or in-person sessions?",
            answer: "Both! Our 'Hybrid' model allows you to mix and match. You can have deep-dive sessions at our physical hubs or quick check-ins online. It's completely flexible to your schedule."
        },
        {
            question: "How are mentors vetted?",
            answer: "Rigorously. We accept less than 3% of applicants. Our vetting process includes technical exams, mock teaching sessions, and background checks. This ensures only the absolute best guide your journey."
        }
    ];

    return (
        <section className="w-full py-32 bg-pink-50 border-t-2 border-black" id="faq">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-20">
                    <h2 className="font-serif text-5xl md:text-6xl text-black mb-4">
                        Curious?
                    </h2>
                    <p className="text-black/60 font-medium">Everything you need to know about the Tow experience.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">

                    {/* Left Column: Questions List */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={cn(
                                    "text-left p-6 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group",
                                    activeIndex === index
                                        ? "bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0)]" // Active styling
                                        : "bg-white border-black text-black shadow-neo hover:-translate-y-1" // Inactive styling
                                )}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <h3 className={cn("font-serif text-lg font-bold pr-4", activeIndex === index ? "text-white" : "text-black")}>
                                        {faq.question}
                                    </h3>
                                    {activeIndex === index ? (
                                        <ArrowRight className="w-5 h-5 shrink-0 text-white" />
                                    ) : (
                                        <Plus className="w-5 h-5 shrink-0 text-black group-hover:rotate-90 transition-transform" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Column: Answer Display */}
                    <div className="lg:col-span-7">
                        <div className="relative h-full min-h-[400px] bg-yellow-100 border-2 border-black rounded-[2rem] p-10 md:p-16 shadow-neo flex flex-col justify-center items-start">

                            {/* Decorative Elements */}
                            <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full border-2 border-black flex items-center justify-center font-bold text-xl shadow-neo-sm">
                                ?
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-black/50 mb-6">Answer</h4>
                                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-black">
                                        {faqs[activeIndex].answer}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
