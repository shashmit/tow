"use client";

import { Badge } from "@/components/ui/badge";
import { X, GraduationCap } from "lucide-react";

const CLASS_LEVELS = [
    { value: "1-5", label: "Class 1-5", description: "Primary" },
    { value: "6-8", label: "Class 6-8", description: "Middle School" },
    { value: "9-10", label: "Class 9-10", description: "High School" },
    { value: "11-12", label: "Class 11-12", description: "Senior Secondary" },
] as const;

const GRANULAR_LEVELS = Array.from({ length: 12 }, (_, i) => ({
    value: `${i + 1}`,
    label: `Class ${i + 1}`,
    description: i < 5 ? 'Primary' : i < 8 ? 'Middle' : i < 10 ? 'High' : 'Senior'
}));

interface ClassLevelSelectProps {
    selectedLevels: string[];
    onLevelsChange: (levels: string[]) => void;
    label?: string;
    singleSelect?: boolean;
    showGranular?: boolean;
}

export function ClassLevelSelect({ selectedLevels, onLevelsChange, label, singleSelect = false, showGranular = false }: ClassLevelSelectProps) {
    const levels = showGranular ? GRANULAR_LEVELS : CLASS_LEVELS;

    const toggleLevel = (value: string) => {
        if (singleSelect) {
            if (selectedLevels.includes(value)) {
                onLevelsChange([]);
            } else {
                onLevelsChange([value]);
            }
        } else {
            if (selectedLevels.includes(value)) {
                onLevelsChange(selectedLevels.filter(l => l !== value));
            } else {
                onLevelsChange([...selectedLevels, value]);
            }
        }
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <GraduationCap className="w-4 h-4" />
                    {label}
                </label>
            )}
            <div className={`grid gap-3 ${showGranular ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-2'}`}>
                {levels.map((level) => {
                    const isSelected = selectedLevels.includes(level.value);

                    return (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => toggleLevel(level.value)}
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
                                <p className="font-bold text-sm">{level.label}</p>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {!showGranular && <p className="text-xs text-gray-400">{level.description}</p>}
                        </button>
                    );
                })}
            </div>
            {selectedLevels.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {selectedLevels.map((value) => {
                        const level = [...CLASS_LEVELS, ...GRANULAR_LEVELS].find(l => l.value === value);
                        return (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="px-3 py-1.5 gap-1.5 text-sm font-medium bg-black text-white hover:bg-gray-800 border-0"
                            >
                                {level?.label}
                                <button
                                    type="button"
                                    onClick={() => toggleLevel(value)}
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
