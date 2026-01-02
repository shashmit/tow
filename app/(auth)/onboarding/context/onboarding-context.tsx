"use client";

import { createContext, useContext, useState, ReactNode, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-context";
import { useAlert } from "@/components/providers/alert-context";

// --- Types ---

export type Role = "tutor" | "student";

export interface OnboardingFormData {
    name: string;
    age: string;
    gender: string;
    phoneNumber: string;
    location: string;
    bio: string;
    // Tutor Specific
    experience: string;
    qualification: string;
    educationMode: string;
    // Student Specific
    learningMode: string;
}

interface OnboardingContextType {
    role: Role;
    setRole: (role: Role) => void;
    email: string | null;
    formData: OnboardingFormData;
    setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    subjects: string[];
    setSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    classLevels: string[];
    setClassLevels: React.Dispatch<React.SetStateAction<string[]>>;
    loading: boolean;
    submitForm: (e: React.FormEvent) => Promise<void>;
    // Step management
    currentStep: number;
    totalSteps: number;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
}

// --- Context ---

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// --- Provider ---

export function OnboardingProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OnboardingProviderContent>{children}</OnboardingProviderContent>
        </Suspense>
    );
}

function OnboardingProviderContent({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { pendingRole, pendingEmail, clearPendingAuth } = useAuth();
    const { showAlert } = useAlert();

    // State - Initialize from AuthContext
    const [role, setRole] = useState<Role>(pendingRole || "student");
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classLevels, setClassLevels] = useState<string[]>([]);
    const [formData, setFormData] = useState<OnboardingFormData>({
        name: "",
        age: "",
        gender: "",
        phoneNumber: "",
        location: "",
        bio: "",
        experience: "",
        qualification: "",
        educationMode: "",
        learningMode: "",
    });

    // Step management
    const totalSteps = 2; // Now only 2 steps: Personal & Role
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        // Validation per step
        if (currentStep === 1) {
            // Validate ALL personal details
            if (!formData.name || formData.name.length < 2) {
                showAlert("Please enter a valid name (min 2 characters).", "error");
                return;
            }
            if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
                showAlert("Please enter a valid age.", "error");
                return;
            }
            if (!formData.gender) {
                showAlert("Please select a gender.", "error");
                return;
            }
            if (!formData.phoneNumber || formData.phoneNumber.length < 5) {
                showAlert("Please enter a valid phone number.", "error");
                return;
            }
            if (!formData.location || formData.location.length < 2) {
                showAlert("Please enter a valid location.", "error");
                return;
            }
        }

        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <= totalSteps) {
            setCurrentStep(step);
        }
    };

    // Sync role from AuthContext if it changes
    useEffect(() => {
        if (pendingRole) {
            setRole(pendingRole);
        }
    }, [pendingRole]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Client-side validation for required fields
        if (!formData.name || formData.name.length < 2) {
            showAlert("Please enter a valid name (min 2 characters).", "error");
            setLoading(false);
            return;
        }

        if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
            showAlert("Please enter a valid age.", "error");
            setLoading(false);
            return;
        }

        if (!formData.gender) {
            showAlert("Please select a gender.", "error");
            setLoading(false);
            return;
        }

        if (!formData.phoneNumber || formData.phoneNumber.length < 5) {
            showAlert("Please enter a valid phone number.", "error");
            setLoading(false);
            return;
        }

        if (!formData.location || formData.location.length < 2) {
            showAlert("Please enter a valid location.", "error");
            setLoading(false);
            return;
        }

        if (role === 'tutor') {
            if (!formData.educationMode) {
                showAlert("Please select an education mode.", "error");
                setLoading(false);
                return;
            }
            if (!formData.experience || isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
                showAlert("Please enter your years of experience.", "error");
                setLoading(false);
                return;
            }
            if (!formData.qualification || formData.qualification.length < 2) {
                showAlert("Please enter your qualification.", "error");
                setLoading(false);
                return;
            }
        }
        if (role === 'student' && !formData.learningMode) {
            showAlert("Please select a learning mode.", "error");
            setLoading(false);
            return;
        }

        if (classLevels.length === 0) {
            showAlert(role === 'tutor' ? "Please select at least one class you teach." : "Please select your class.", "error");
            setLoading(false);
            return;
        }

        if (subjects.length === 0) {
            showAlert(role === 'tutor' ? "Please select at least one subject you teach." : "Please select at least one subject you want to learn.", "error");
            setLoading(false);
            return;
        }

        try {
            // Build base payload with common fields
            const payload: Record<string, unknown> = {
                name: formData.name,
                age: formData.age ? parseInt(formData.age, 10) : undefined,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                location: formData.location,
                bio: formData.bio,
                subjects,
                classLevels,
            };

            // Add role-specific fields only if they have values (now required, but checking value exists)
            if (role === 'tutor') {
                if (formData.experience) payload.experience = formData.experience;
                if (formData.qualification) payload.qualification = formData.qualification;
                payload.educationMode = formData.educationMode;
            } else {
                payload.learningMode = formData.learningMode;
            }

            const res = await fetch("/api/auth/onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            // Clear pending auth data after successful onboarding
            clearPendingAuth();
            router.push("/dashboard");

        } catch (error) {
            console.error("Onboarding failed:", error);
            showAlert("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const value: OnboardingContextType = {
        role,
        setRole,
        email: pendingEmail,
        formData,
        setFormData,
        handleInputChange,
        subjects,
        setSubjects,
        classLevels,
        setClassLevels,
        loading,
        submitForm,
        // Step management
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        goToStep,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

// --- Hook ---

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}

