"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Loader2 } from "lucide-react";

interface Subject {
    id: string;
    name: string;
    slug: string;
    category: string | null;
    description: string | null;
}

interface SubjectSelectProps {
    selectedSubjects: string[];
    onSubjectsChange: (subjects: string[]) => void;
    label?: string;
}

export function SubjectSelect({ selectedSubjects, onSubjectsChange, label }: SubjectSelectProps) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubjects() {
            try {
                const res = await fetch("/api/subjects");
                if (!res.ok) throw new Error("Failed to fetch subjects");
                const data = await res.json();
                setSubjects(data.subjects);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSubjects();
    }, []);

    const toggleSubject = (slug: string) => {
        if (selectedSubjects.includes(slug)) {
            onSubjectsChange(selectedSubjects.filter(s => s !== slug));
        } else {
            onSubjectsChange([...selectedSubjects, slug]);
        }
    };

    // Group subjects by category
    const groupedSubjects = subjects.reduce((acc, subject) => {
        const category = subject.category || "general";
        if (!acc[category]) acc[category] = [];
        acc[category].push(subject);
        return acc;
    }, {} as Record<string, Subject[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-sm p-4 text-center">
                Failed to load subjects. Please refresh.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {label && (
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    {label}
                </label>
            )}

            <div className="space-y-4">
                {/* General subjects (no category) */}
                {groupedSubjects["general"] && (
                    <div className="grid grid-cols-2 gap-3">
                        {groupedSubjects["general"].map((subject) => {
                            const isSelected = selectedSubjects.includes(subject.slug);
                            return (
                                <button
                                    key={subject.slug}
                                    type="button"
                                    onClick={() => toggleSubject(subject.slug)}
                                    className={`
                                        relative cursor-pointer rounded-2xl p-4 text-left transition-all
                                        border-2 flex flex-col gap-1
                                        ${isSelected
                                            ? 'border-black bg-gray-50 shadow-neo-sm'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-sm">{subject.name}</p>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Chemistry category */}
                {groupedSubjects["chemistry"] && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chemistry</p>
                        <div className="grid grid-cols-2 gap-3">
                            {groupedSubjects["chemistry"].map((subject) => {
                                const isSelected = selectedSubjects.includes(subject.slug);
                                const displayName = subject.name.replace("Chemistry - ", "");
                                return (
                                    <button
                                        key={subject.slug}
                                        type="button"
                                        onClick={() => toggleSubject(subject.slug)}
                                        className={`
                                            relative cursor-pointer rounded-2xl p-4 text-left transition-all
                                            border-2 flex flex-col gap-1
                                            ${isSelected
                                                ? 'border-black bg-gray-50 shadow-neo-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-sm">{displayName}</p>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Selected badges */}
            {selectedSubjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {selectedSubjects.map((slug) => {
                        const subject = subjects.find(s => s.slug === slug);
                        return (
                            <Badge
                                key={slug}
                                variant="secondary"
                                className="px-3 py-1.5 gap-1.5 text-sm font-medium bg-black text-white hover:bg-gray-800 border-0"
                            >
                                {subject?.name || slug}
                                <button
                                    type="button"
                                    onClick={() => toggleSubject(slug)}
                                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
