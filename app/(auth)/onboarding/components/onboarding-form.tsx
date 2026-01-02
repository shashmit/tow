"use client";

import { useOnboarding } from "../hooks/use-onboarding";
import { CombinedPersonalDetails } from "./personal-details";
import { RoleSpecific } from "./role-specific";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const STEP_TITLES = {
    1: "Personal Details",
    2: "Role Specifics",
};

const STEP_SUBTITLES = {
    1: "Tell us about yourself",
    2: "Customize your experience",
};

export function OnboardingForm() {
    const { role, loading, submitForm, currentStep, totalSteps, nextStep, prevStep, formData, handleInputChange, subjects, setSubjects, classLevels, setClassLevels } = useOnboarding();
    const isTutor = role === 'tutor';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < totalSteps) {
            nextStep();
        } else {
            submitForm(e);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-8 text-center space-y-2">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1"
                >
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                        {STEP_TITLES[currentStep as keyof typeof STEP_TITLES]}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {STEP_SUBTITLES[currentStep as keyof typeof STEP_SUBTITLES]}
                    </p>
                </motion.div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
                        >
                            {currentStep === 1 && (
                                <CombinedPersonalDetails
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                />
                            )}
                            {currentStep === 2 && (
                                <RoleSpecific
                                    role={role}
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    subjects={subjects}
                                    setSubjects={setSubjects}
                                    classLevels={classLevels}
                                    setClassLevels={setClassLevels}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8">
                    {currentStep > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="h-14 px-6 rounded-2xl font-bold text-base border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Back
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className={`
                            flex-1 h-14 rounded-2xl font-bold text-base transition-all
                            ${currentStep === totalSteps
                                ? isTutor
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300'
                                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black shadow-lg shadow-amber-200 hover:shadow-amber-300'
                                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-gray-200'
                            }
                            hover:scale-[1.02] active:scale-[0.98]
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Saving...
                            </span>
                        ) : currentStep === totalSteps ? (
                            <span className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Complete Setup
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                Continue
                                <ChevronRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </div>

                {/* Progress hint */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Step {currentStep} of {totalSteps}
                </p>
            </form>
        </div>
    );
}
