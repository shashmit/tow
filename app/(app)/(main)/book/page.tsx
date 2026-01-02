"use client";

import { useMemo, useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react"; // Added Loader2
import { cn } from "@/lib/utils";
import { Tutor } from "@/lib/tutors"; // Updated import
import { TutorCard } from "@/components/student/tutor-card";
import { useDashboard } from "../layout";

export default function BookSessionPage() {
    const { userDoc } = useDashboard(); // Access context if needed

    // 1. Date Selection Logic
    // Generate next 7 days
    const dates = useMemo(() => {
        const d = new Date();
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(d);
            date.setDate(d.getDate() + i);
            days.push({
                date: date,
                dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
                dateString: date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
                isoString: date.toISOString().split("T")[0],
            });
        }
        return days;
    }, []);

    // Default to first day (today)
    const [selectedDateIndices, setSelectedDateIndices] = useState<number[]>([0]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    // Data State
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

    const toggleDate = (index: number) => {
        setSelectedDateIndices((prev) => {
            if (prev.includes(index)) {
                return prev.filter((i) => i !== index);
            } else {
                return [...prev, index];
            }
        });
        setSelectedSubject(null);
    };

    // Fetch Tutors when Date Selection Changes
    useEffect(() => {
        async function fetchAvailableTutors() {
            if (selectedDateIndices.length === 0) {
                setTutors([]);
                setAvailableSubjects([]);
                return;
            }

            setIsLoading(true);
            try {
                // We'll fetch for each selected date and aggregate? 
                // Or easier: Just fetch for the FIRST selected date for now if API doesn't support multiple arrays.
                // To support multiple dates properly, we'd need to modify the API to accept list OR make multiple requests.
                // Let's make multiple requests and merge for now to be robust.

                const selectedIsoDates = selectedDateIndices.map(i => dates[i].isoString);
                const results = await Promise.all(selectedIsoDates.map(date =>
                    fetch(`/api/tutors?date=${date}`).then(res => res.json())
                ));

                // Merge results (arrays of tutor docs)
                const allDocsMap = new Map();
                results.forEach((docs: any[]) => {
                    if (Array.isArray(docs)) {
                        docs.forEach(doc => allDocsMap.set(doc.$id, doc));
                    }
                });

                const uniqueDocs = Array.from(allDocsMap.values());

                // Map to Tutor Interface
                const mappedTutors: Tutor[] = uniqueDocs.map((doc: any) => ({
                    id: doc.$id,
                    name: doc.name || "Unknown Tutor",
                    subjects: doc.subjects || [],
                    role: "Instructor",
                    exp: doc.experience || "N/A",
                    methods: doc.educationMode ? [doc.educationMode] : [],
                    rate: "Contact for price",
                    rating: 0,
                    reviews: 0,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name || "T")}&background=random`,
                    bio: doc.bio || "",
                    featured: false,
                    classLevels: doc.classLevels || [],
                    availability: []
                }));

                setTutors(mappedTutors);

                // Derive subjects
                const subjects = new Set<string>();
                mappedTutors.forEach(t => t.subjects.forEach(s => subjects.add(s)));
                setAvailableSubjects(Array.from(subjects).sort());

            } catch (error) {
                console.error("Error fetching tutors:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAvailableTutors();
    }, [selectedDateIndices, dates]);


    // Filter displayed tutors by subject
    const displayedTutors = useMemo(() => {
        let filtered = tutors;
        if (selectedSubject) {
            filtered = filtered.filter((tutor) => tutor.subjects.includes(selectedSubject));
        }
        return filtered;
    }, [tutors, selectedSubject]);


    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header moved to layout */}

            <div className="flex flex-col gap-8">

                {/* Step 1: Date Selection */}
                <section className="bg-white border-2 border-black rounded-3xl p-6 shadow-neo">
                    <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">1</span>
                        Pick Date(s)
                    </h2>

                    <div className="flex gap-3 overflow-x-auto py-4 px-2 no-scrollbar">
                        {dates.map((date, index) => {
                            const isSelected = selectedDateIndices.includes(index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => toggleDate(index)}
                                    className={cn(
                                        "flex flex-col items-center justify-center min-w-[80px] h-24 rounded-2xl border-2 transition-all duration-200 relative",
                                        isSelected
                                            ? "bg-yellow-300 border-black shadow-neo transform -translate-y-1"
                                            : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"
                                    )}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 text-black">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider mb-1">
                                        {date.dayName.slice(0, 3)}
                                    </span>
                                    <span className="text-2xl font-black">
                                        {date.date.getDate()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Step 2: Subject Selection */}
                {selectedDateIndices.length > 0 && (
                    <section className="bg-white border-2 border-black rounded-3xl p-6 shadow-neo animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">2</span>
                            Select Subject
                        </h2>

                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="animate-spin" size={20} /> Loading subjects...
                            </div>
                        ) : availableSubjects.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedSubject(null)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all",
                                        selectedSubject === null
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-black"
                                    )}
                                >
                                    All Subjects
                                </button>
                                {availableSubjects.map((subject) => (
                                    <button
                                        key={subject}
                                        onClick={() => setSelectedSubject(subject)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all",
                                            selectedSubject === subject
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-black"
                                        )}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No tutors available for the selected dates.</p>
                        )}
                    </section>
                )}

                {/* Step 3: Tutors */}
                {selectedDateIndices.length > 0 && (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <h2 className="text-xl font-black mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">3</span>
                            Available Tutors ({displayedTutors.length})
                        </h2>

                        {isLoading ? (
                            <div className="py-12 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                                <p className="text-gray-400 mt-2">Finding available tutors...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedTutors.length > 0 ? (
                                    displayedTutors.map((tutor) => (
                                        <TutorCard key={tutor.id} tutor={tutor} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-black">
                                        <p className="text-gray-500 font-medium">No tutors found for this combination.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

