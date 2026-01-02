"use client";

import { Star, Clock, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/lib/tutors";

interface TutorCardProps {
    tutor: Tutor;
}

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TutorCard({ tutor }: TutorCardProps) {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);


    return (
        <div
            className="relative bg-white rounded-2xl overflow-hidden border-2 border-black shadow-neo"
        >
            <div className="p-4 flex flex-col h-full">
                {/* Header with Avatar */}
                <div className="flex items-start gap-4 mb-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={tutor.image}
                            alt={tutor.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-black"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-white border-2 border-black px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm flex items-center">
                            <Star size={8} className="text-yellow-500 mr-0.5 fill-yellow-500" />
                            {tutor.rating}
                        </div>
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-black truncate leading-tight">
                                    {tutor.name}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{tutor.role}</p>
                            </div>
                            <span className="text-xs font-black text-black bg-yellow-200 px-2 py-0.5 rounded-lg border-2 border-black whitespace-nowrap ml-2 flex-shrink-0">
                                {tutor.exp}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {tutor.subjects.map((subject) => (
                        <span key={subject} className="px-2 py-0.5 bg-gray-100 text-gray-800 text-[10px] rounded-full font-bold border-2 border-black">
                            {subject}
                        </span>
                    ))}
                    {tutor.classLevels?.map((level) => (
                        <span key={level} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-full font-bold border-2 border-blue-200">
                            {level}
                        </span>
                    ))}
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">
                    {tutor.bio}
                </p>

                {/* Footer */}
                <Button
                    className="w-full rounded-xl font-bold h-10 text-xs transition-all duration-300 ease-in-out"
                    onClick={() => router.push(`/book/${tutor.id}`)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <span className="flex items-center gap-2 transition-all duration-300">
                        {isHovered ? (
                            <>
                                Book Session <Calendar size={14} />
                            </>
                        ) : (
                            <>
                                View Profile <ChevronRight size={14} />
                            </>
                        )}
                    </span>
                </Button>
            </div>
        </div>
    );
}
