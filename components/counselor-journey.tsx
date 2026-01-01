"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, UserCheck, BookOpen, Rocket } from "lucide-react";

export function CounselorJourney() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-play logic
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => (prev === 3 ? 0 : prev + 1));
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    const steps = [
        {
            id: "01",
            title: "Discovery",
            short: "We analyze your goals.",
            color: "bg-pink-300",
            icon: Search,
            details: {
                heading: "Deep Dive Analysis.",
                text: "We don't just ask 'what subject?'. We analyze learning styles, personality traits, and long-term ambitions. We conduct a 45-minute consultation to build a psychological scholar profile."
            }
        },
        {
            id: "02",
            title: "Match",
            short: "Hand-picked mentors.",
            color: "bg-blue-300",
            icon: UserCheck,
            details: {
                heading: "The Perfect Fit.",
                text: "Our algorithm narrows it down, but humans make the final call. We present you with 3 hand-selected mentors who overlap not just in subject expertise, but in shared interests and teaching philosophy."
            }
        },
        {
            id: "03",
            title: "Trial",
            short: "Chemistry check.",
            color: "bg-green-300",
            icon: BookOpen,
            details: {
                heading: "Risk-Free First Session.",
                text: "The first hour is a chemistry test. If you don't feel a spark of inspiration, you don't pay. We want mentorships that last years, not weeks."
            }
        },
        {
            id: "04",
            title: "Launch",
            short: "Liftoff.",
            color: "bg-yellow-300",
            icon: Rocket,
            details: {
                heading: "Continuous Calibration.",
                text: "We set a roadmap. We track progress. We adjust. Every month, you get a detailed report not just on grades, but on confidence, curiosity, and critical thinking metrics."
            }
        }
    ];

    return (
        <section className="w-full py-32 bg-white border-t-2 border-black relative" id="journey">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="bg-black text-white px-3 py-1 font-bold uppercase tracking-widest text-sm mb-4 inline-block shadow-neo-sm transform -rotate-2">Process</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-black mt-4">The Concierge Model.</h2>
                    <p className="mt-4 text-black/60 font-medium">Sit back. We do the heavy lifting.</p>
                </div>

                <div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[500px]"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >

                    {/* Left Column: Vertical Tabs */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {steps.map((step, i) => {
                            const isActive = activeStep === i;
                            const Icon = step.icon;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setActiveStep(i)}
                                    className={cn(
                                        "flex items-center gap-6 p-6 rounded-[1.5rem] border-2 transition-all duration-300 relative group text-left overflow-hidden",
                                        isActive
                                            ? "bg-black border-black text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0)] translate-x-[2px] translate-y-[2px]"
                                            : "bg-white border-black text-black shadow-neo hover:-translate-y-1 hover:bg-gray-50"
                                    )}
                                >
                                    {/* Progress Fill Animation */}
                                    {isActive && !isPaused && (
                                        <motion.div
                                            className="absolute inset-0 bg-yellow-500 z-0 origin-left"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 4, ease: "linear" }}
                                        />
                                    )}

                                    <div className={cn(
                                        "w-12 h-12 shrink-0 rounded-full border-2 border-black flex items-center justify-center text-lg font-black transition-colors relative z-10",
                                        isActive ? "bg-white text-black" : step.color
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="relative z-10">
                                        <h3 className="font-serif text-xl font-bold">{step.title}</h3>
                                        <p className={cn("text-xs font-bold uppercase tracking-wide mt-1 line-clamp-1", isActive ? "text-white" : "text-black/50")}>{step.short}</p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right Column: Detailed Content Pane */}
                    <div className="lg:col-span-8 flex flex-col h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex-1 rounded-[2rem] border-2 border-black shadow-neo p-8 md:p-16 relative overflow-hidden flex flex-col justify-center",
                                    steps[activeStep].color
                                )}
                            >
                                {/* Decorative Big Number */}
                                <div className="absolute -bottom-10 -right-10 text-[20rem] font-sans font-black text-black/5 select-none leading-none">
                                    {steps[activeStep].id}
                                </div>

                                <div className="relative z-10">
                                    <div className="bg-black text-white text-xs font-bold uppercase tracking-widest px-3 py-1 inline-block rounded mb-6">
                                        Step {steps[activeStep].id}
                                    </div>
                                    <h3 className="font-serif text-5xl md:text-6xl text-black mb-8 leading-tight">{steps[activeStep].details.heading}</h3>
                                    <p className="text-xl md:text-2xl font-medium text-black/80 leading-relaxed max-w-2xl">
                                        {steps[activeStep].details.text}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
