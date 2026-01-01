"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { account, databases } from "@/lib/appwrite";
import { Models } from "appwrite";

const StyledLabel = ({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) => <label htmlFor={htmlFor} className="block text-sm font-bold mb-2">{children}</label>;
const StyledTextarea = (props: any) => <textarea {...props} className="w-full min-h-[100px] p-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 resize-none bg-gray-50/50" />;

export default function OnboardingPage() {
    const router = useRouter();
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [userDoc, setUserDoc] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);

    // Common Fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState<number | "">("");

    // Student Fields
    const [grade, setGrade] = useState("");
    const [subjects, setSubjects] = useState("");

    // Tutor Fields
    const [expertise, setExpertise] = useState("");
    const [experience, setExperience] = useState<number | "">("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Get Auth User
                const currentUser = await account.get();
                setUser(currentUser);

                // 2. Get DB Document to know role
                const doc = await databases.getDocument(
                    "tow-db",
                    "users",
                    currentUser.$id
                );
                setUserDoc(doc);
                console.log("Fetched User Doc:", doc);

                if (doc.isOnboardingComplete) {
                    router.push("/dashboard");
                    return;
                }

                // Pre-fill email or name if available in Auth
                if (currentUser.name) setName(currentUser.name);

            } catch (error) {
                console.error("Auth check failed", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        try {
            const role = userDoc?.role;
            const commonData = {
                name,
                phone,
                age: Number(age),
            };

            const roleData = role === "student"
                ? { grade, subjects }
                : { expertise, experience: Number(experience), bio };

            const payload = {
                userId: user?.$id,
                data: {
                    ...commonData,
                    ...roleData
                }
            };

            const res = await fetch("/api/user/complete-onboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save profile");

            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding failed", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8]">Loading...</div>;
    if (!user || !userDoc) return null;

    const isStudent = userDoc.role === "student";

    return (
        <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white border-2 border-black rounded-[2rem] shadow-neo-xl p-8 md:p-12">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">
                        {isStudent ? "Student Profile" : "Tutor Profile"}
                    </h1>
                    <p className="text-gray-500 font-medium text-lg">
                        {isStudent ? "Help us find the best tutors for you." : "Tell us about your teaching experience."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Common Fields */}
                    <div className="space-y-2">
                        <StyledLabel htmlFor="name">Full Name</StyledLabel>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <StyledLabel htmlFor="phone">Phone Number</StyledLabel>
                            <Input
                                id="phone"
                                placeholder="+1 234..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <StyledLabel htmlFor="age">Age</StyledLabel>
                            <Input
                                id="age"
                                type="number"
                                placeholder="18"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                required
                                className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                            />
                        </div>
                    </div>

                    <div className="border-t-2 border-gray-100 my-4"></div>

                    {isStudent && (
                        <>
                            <div className="space-y-2">
                                <StyledLabel htmlFor="grade">Current Grade / Level</StyledLabel>
                                <Input
                                    id="grade"
                                    placeholder="e.g. 10th Grade, University (Year 2)"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    required
                                    className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <StyledLabel htmlFor="subjects">Subjects you need help with</StyledLabel>
                                <Input
                                    id="subjects"
                                    placeholder="e.g. Math, Physics, English"
                                    value={subjects}
                                    onChange={(e) => setSubjects(e.target.value)}
                                    required
                                    className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                                />
                            </div>
                        </>
                    )}

                    {!isStudent && (
                        <>
                            <div className="space-y-2">
                                <StyledLabel htmlFor="expertise">Areas of Expertise</StyledLabel>
                                <Input
                                    id="expertise"
                                    placeholder="e.g. Advanced Calculus, Literature"
                                    value={expertise}
                                    onChange={(e) => setExpertise(e.target.value)}
                                    required
                                    className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <StyledLabel htmlFor="experience">Years of Experience</StyledLabel>
                                <Input
                                    id="experience"
                                    type="number"
                                    placeholder="e.g. 3"
                                    value={experience}
                                    onChange={(e) => setExperience(Number(e.target.value))}
                                    required
                                    className="h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <StyledLabel htmlFor="bio">Short Bio</StyledLabel>
                                <StyledTextarea
                                    id="bio"
                                    placeholder="Tell students about your teaching style..."
                                    value={bio}
                                    onChange={(e: any) => setBio(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        disabled={pending}
                        className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-lg shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all mt-4"
                    >
                        {pending ? "Saving..." : "Complete Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
