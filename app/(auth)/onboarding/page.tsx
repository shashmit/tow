"use client";

import { OnboardingProvider } from "./context/onboarding-context";
import { OnboardingForm } from "./components/onboarding-form";
import { PageLoader } from "@/components/ui/page-loader";
import { useOnboarding } from "./hooks/use-onboarding";
import { motion } from "framer-motion";

export default function OnboardingPage() {
    return (
        <OnboardingProvider>
            <OnboardingContentWrapper />
        </OnboardingProvider>
    );
}

function OnboardingContentWrapper() {
    const { loading, role } = useOnboarding();

    return (
        <div className="min-h-screen bg-[#FFFDF8] font-sans">
            <div className="grid lg:grid-cols-[45fr_55fr] min-h-screen">
                {/* Left Panel - Hero Image */}
                <div className="hidden lg:block relative overflow-hidden">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 ${role === 'tutor'
                        ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600'
                        : 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500'
                        }`} />

                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="2" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#dots)" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-black tracking-tight">Tow</h2>
                        </motion.div>

                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h1 className="text-5xl font-black leading-tight">
                                {role === 'tutor' ? (
                                    <>Share your<br />knowledge<br />with the world</>
                                ) : (
                                    <>Find your<br />perfect<br />mentor</>
                                )}
                            </h1>
                            <p className="text-lg opacity-90 max-w-sm leading-relaxed">
                                {role === 'tutor'
                                    ? "Connect with eager students and make a real impact on their learning journey."
                                    : "Get personalized guidance from experienced tutors who care about your success."
                                }
                            </p>
                        </motion.div>

                        {/* Decorative shapes */}
                        <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="w-16 h-16 rounded-2xl border-2 border-white/30 backdrop-blur-sm" />
                            <div className="w-16 h-16 rounded-full border-2 border-white/30 backdrop-blur-sm" />
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm" />
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex flex-col min-h-screen lg:min-h-0">
                    {/* Mobile header */}
                    <div className="lg:hidden p-4 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-xl font-black">Tow</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${role === 'tutor'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {role === 'tutor' ? 'Tutor' : 'Student'}
                        </span>
                    </div>

                    {/* Form container */}
                    <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                        <motion.div
                            className="w-full max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <OnboardingForm />
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 text-center text-xs text-gray-400">
                        By continuing, you agree to our Terms of Service
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 z-50">
                    <PageLoader />
                </div>
            )}
        </div>
    );
}
