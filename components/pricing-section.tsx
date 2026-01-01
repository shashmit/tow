"use client";

import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PricingSection() {
    const plans = [
        {
            id: "basic",
            name: "Basic Plan",
            price: "$19",
            period: "/month",
            description: "Perfect for self-driven students who need structured guidance and resources.",
            features: [
                { name: "4 Online Group Sessions", included: true },
                { name: "Full Digital Suite Access", included: true },
                { name: "24/7 Concierge Mentor Chat", included: true },
                { name: "Printed Strategy Materials", included: true },
                { name: "Weekly Progress Tracking", included: true },
                { name: "Community Forum Access", included: true },
                { name: "Basic Doubt Resolution", included: true },
                // Excluded items compared to Enterprise
                { name: "Hybrid (In-Person) Sessions", included: false },
                { name: "Dedicated Senior Mentor", included: false },
                { name: "Custom Strategy Roadmap", included: false },
                { name: "Unlimited Mock Tests", included: false }
            ],
            // Visual Config (Blue Theme - Online)
            theme: {
                bg: "bg-blue-50",
                hoverBg: "hover:bg-blue-100",
                border: "border-blue-200",
                accent: "text-blue-600",
                button: "bg-blue-600 hover:bg-blue-700",
                icon: "text-blue-600",
                iconFill: "fill-blue-600"
            }
        },
        {
            id: "enterprise",
            name: "Enterprise Plan",
            price: "$29",
            period: "/month",
            description: "The complete concierge experience for those demanding mastery.",
            features: [
                { name: "4 Hybrid (In-Person) Sessions", included: true },
                { name: "Full Physical Hub Access", included: true },
                { name: "24/7 Dedicated Senior Mentor", included: true },
                { name: "Custom Strategy Roadmap", included: true },
                { name: "Monthly Parent Reports", included: true },
                { name: "Priority Doubt Resolution", included: true },
                { name: "Unlimited Mock Tests", included: true },
                { name: "Exclusive Workshops & Events", included: true }
            ],
            // Visual Config (Emerald Theme - Hybrid)
            theme: {
                bg: "bg-emerald-50",
                hoverBg: "hover:bg-emerald-100",
                border: "border-emerald-200",
                accent: "text-emerald-700",
                button: "bg-emerald-600 hover:bg-emerald-700",
                icon: "text-emerald-700",
                iconFill: "fill-emerald-700"
            }
        }
    ];

    return (
        <section className="w-full py-16 md:py-32 bg-white border-t-2 border-black" id="pricing">
            <div className="container mx-auto px-4 md:px-6">

                {/* Removed items-start to allow the grid columns to stretch, enabling sticky behavior */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

                    {/* Left Column: Headers and Context */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
                        <div className="bg-pink-100 px-4 py-1.5 rounded-full border-2 border-black inline-block shadow-neo-sm mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-black">Transparent Pricing</span>
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl text-black mb-6 leading-[0.9]">
                            Invest In Your <br />Future Without <br />The Guesswork.
                        </h2>
                        <p className="text-lg text-black/70 font-medium leading-relaxed mb-8">
                            Simple, honest pricing. You get exactly what you see. No hidden fees, no up-selling, just pure educational value.
                        </p>
                        <div className="flex flex-col gap-2 text-sm font-bold text-black/50">
                            <p>contact@tow.education</p>
                            <p>+1 (555) 012-3456</p>
                        </div>
                    </div>

                    {/* Right Column: Pricing Cards */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                className={cn(
                                    "rounded-[2.5rem] p-8 border-2 border-black shadow-neo flex flex-col transition-colors duration-300",
                                    plan.theme.bg,
                                    plan.theme.hoverBg
                                )}
                                whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #000' }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className={cn("font-serif text-2xl font-bold mb-4", plan.theme.accent)}>
                                    {plan.name}
                                </h3>

                                <div className="flex items-baseline mb-4">
                                    <span className="text-5xl font-black text-black tracking-tighter">{plan.price}</span>
                                    <span className="text-black/60 font-medium text-lg ml-2">{plan.period}</span>
                                </div>

                                <p className="text-black/60 text-sm leading-relaxed mb-8 min-h-[3rem]">
                                    {plan.description}
                                </p>

                                <div className="flex-1 space-y-4 mb-10">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className={cn("flex items-center gap-3", !feature.included && "opacity-50")}>
                                            {feature.included ? (
                                                <CheckCircle2 className={cn("w-6 h-6 shrink-0", plan.theme.iconFill, "text-white")} />
                                            ) : (
                                                <div className="w-6 h-6 shrink-0 rounded-full border-2 border-black/20 flex items-center justify-center bg-gray-100">
                                                    <span className="text-black/40 text-xs font-bold">✕</span>
                                                </div>
                                            )}
                                            <span className={cn("text-sm font-bold", feature.included ? "text-black" : "text-black/40 line-through decoration-2")}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Button className={cn(
                                    "w-full text-white font-bold h-14 rounded-xl border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all",
                                    plan.theme.button
                                )}>
                                    Get Started
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
