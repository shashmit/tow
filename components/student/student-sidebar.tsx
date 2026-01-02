"use client";

import { SUBJECTS, METHODS } from "@/lib/tutors";

interface StudentSidebarProps {
    selectedSubject: string;
    setSelectedSubject: (subject: string) => void;
    selectedMethod: string;
    setSelectedMethod: (method: string) => void;
    mobileMenuOpen: boolean;
}

export function StudentSidebar({
    selectedSubject,
    setSelectedSubject,
    selectedMethod,
    setSelectedMethod,
    mobileMenuOpen,
}: StudentSidebarProps) {
    return (
        <aside
            className={`lg:w-64 flex-shrink-0 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}
        >
            <div className="sticky top-24 space-y-6">
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
                                className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded-full accent-black"
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
                                    className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded-full accent-black"
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
                                className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded-full accent-black"
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
                                    className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded-full accent-black"
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
            </div>
        </aside>
    );
}
