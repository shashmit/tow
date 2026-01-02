"use client";

import { redirect } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SUBJECTS, METHODS, TeachingMethod, Tutor } from "@/lib/tutors";
import { TutorCard } from "@/components/student/tutor-card";
import { useDashboard } from "../layout";
import { Loader2 } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";

export default function TutorsPage() {
    const { userDoc } = useDashboard();
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [selectedMethod, setSelectedMethod] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tutors from API
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await fetch("/api/tutors");
                if (!response.ok) {
                    throw new Error("Failed to fetch tutors");
                }
                const data = await response.json();

                // Map API response to Tutor interface
                const mappedTutors: Tutor[] = data.map((doc: any) => ({
                    id: doc.$id, // Using string UUID from Appwrite
                    name: doc.name || "Unknown Tutor",
                    subjects: doc.subjects || [],
                    role: userDoc?.role === "student" ? "Tutor" : "Instructor", // Default role label
                    exp: doc.experience || "N/A",
                    methods: doc.educationMode ? [doc.educationMode] : [], // user_meta has single mode, mapping to array
                    rate: "Contact for price", // Not in DB yet
                    rating: 0, // Not in DB yet
                    reviews: 0, // Not in DB yet
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || "T")}&background=random`, // Placeholder
                    bio: doc.bio || "No biography available.",
                    featured: false,
                    classLevels: doc.classLevels || [],
                    availability: [] // Not needed for card display, fetched in booking
                }));

                setTutors(mappedTutors);
            } catch (err: any) {
                console.error("Error loading tutors:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutors();
    }, [userDoc]);

    const filteredTutors = useMemo(() => {
        return tutors.filter((tutor) => {
            const matchSubject =
                selectedSubject === "All" || tutor.subjects.includes(selectedSubject);

            // Allow matching if method includes the selected method (since mapped data might have single item array)
            const matchMethod =
                selectedMethod === "All" ||
                tutor.methods.some(m => m.toLowerCase() === selectedMethod.toLowerCase()) ||
                (selectedMethod === "Hybrid" && tutor.methods.includes("Hybrid"));

            const matchSearch =
                tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tutor.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                tutor.bio.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSubject && matchMethod && matchSearch;
        });
    }, [selectedSubject, selectedMethod, searchQuery, tutors]);

    // If user is a tutor, they shouldn't really see this page, but if they navigate here manually:
    if (userDoc?.role === "tutor") {
        redirect("/dashboard");
    }

    if (isLoading) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 font-medium">Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0 space-y-6">
                {/* Search */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                        Search
                    </h3>
                    <input
                        type="text"
                        placeholder="Search tutors..."
                        className="w-full px-4 py-2 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Subject Filter */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                        Subjects
                    </h3>
                    <div className="space-y-2">
                        <label className="flex items-center group cursor-pointer">
                            <input
                                type="radio"
                                name="subject"
                                className="h-4 w-4 accent-black"
                                checked={selectedSubject === "All"}
                                onChange={() => setSelectedSubject("All")}
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
                                All Subjects
                            </span>
                        </label>
                        {SUBJECTS.map((subject) => (
                            <label
                                key={subject}
                                className="flex items-center group cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="subject"
                                    className="h-4 w-4 accent-black"
                                    checked={selectedSubject === subject}
                                    onChange={() => setSelectedSubject(subject)}
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
                                    {subject}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Method Filter */}
                <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                        Teaching Method
                    </h3>
                    <div className="space-y-2">
                        <label className="flex items-center group cursor-pointer">
                            <input
                                type="radio"
                                name="method"
                                className="h-4 w-4 accent-black"
                                checked={selectedMethod === "All"}
                                onChange={() => setSelectedMethod("All")}
                            />
                            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
                                Any Method
                            </span>
                        </label>
                        {METHODS.map((method) => (
                            <label
                                key={method}
                                className="flex items-center group cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="method"
                                    className="h-4 w-4 accent-black"
                                    checked={selectedMethod === method}
                                    onChange={() => setSelectedMethod(method)}
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black">
                                    {method}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Tutors Grid */}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredTutors.length > 0 ? (
                        filteredTutors.map((tutor) => (
                            <TutorCard key={tutor.id} tutor={tutor} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-black">
                            <p className="text-gray-500 font-medium">No tutors found</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Try adjusting your filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
