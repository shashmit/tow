"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CombinedPersonalDetails } from "@/app/(auth)/onboarding/components/personal-details";
import { RoleSpecific } from "@/app/(auth)/onboarding/components/role-specific";
import { Button } from "@/components/ui/button";
import { Save, Camera, Loader2, User } from "lucide-react";
import { useAlert } from "@/components/providers/alert-context";
import { PageLoader } from "@/components/ui/page-loader";

export default function ProfilePage() {
    const router = useRouter();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userDoc, setUserDoc] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
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
        imageUrl: "",
    });
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classLevels, setClassLevels] = useState<string[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile");
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setUserDoc(data);
                // Populate form
                setFormData({
                    name: data.name || "",
                    age: data.age?.toString() || "",
                    gender: data.gender || "",
                    phoneNumber: data.phone || "", // API returns phone
                    location: data.location || "",
                    bio: data.bio || "",
                    experience: data.experience || "",
                    qualification: data.qualification || "",
                    educationMode: data.educationMode || "",
                    learningMode: data.learningMode || "",
                    imageUrl: data.imageUrl || "",
                });
                setSubjects(data.subjects || []);
                setClassLevels(data.classLevels || []);

            } catch (error) {
                console.error("Failed to fetch profile", error);
                showAlert("Failed to load profile", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router, showAlert]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subjects,
                    classLevels,
                    // Parse age
                    age: parseInt(formData.age),
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Update failed");
            }
            showAlert("Profile updated successfully!", "success");
            // Update userDoc for header
            setUserDoc({ ...userDoc, ...formData });
        } catch (err: any) {
            console.error(err);
            showAlert("Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-neo">
                <form onSubmit={handleSave} className="space-y-8">
                    <section>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="bg-yellow-200 px-3 py-1 border-2 border-black rounded-lg text-sm shadow-neo-sm">1</span>
                            Personal Details
                        </h3>
                        <CombinedPersonalDetails
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setFormData={setFormData}
                        />
                    </section>

                    <div className="border-t-2 border-dashed border-gray-200" />

                    <section>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                            <span className="bg-purple-200 px-3 py-1 border-2 border-black rounded-lg text-sm shadow-neo-sm">2</span>
                            Role Specifics
                        </h3>
                        <RoleSpecific
                            role={userDoc?.role || "student"}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            subjects={subjects}
                            setSubjects={setSubjects}
                            classLevels={classLevels}
                            setClassLevels={setClassLevels}
                        />
                    </section>

                    <div className="flex justify-end pt-6 border-t-2 border-gray-100 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-14 px-8 rounded-2xl font-bold text-base bg-black text-white hover:scale-105 transition-all shadow-neo hover:shadow-none hover:bg-emerald-500 hover:text-black hover:border-black border-2 border-transparent"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                            {!saving && <Save className="ml-2 h-5 w-5" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
