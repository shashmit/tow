"use client";

import { Input } from "@/components/ui/input";
import { SubjectSelect } from "@/components/ui/subject-select";
import { ClassLevelSelect } from "@/components/ui/class-level-select";
import { Briefcase, Monitor, Users, BookOpen, Laptop, GraduationCap } from "lucide-react";

const MODE_ICONS = {
    hybrid: Users,
    physical: BookOpen,
    online: Laptop,
};

const MODE_DESCRIPTIONS = {
    hybrid: "Mix of both",
    physical: "In-person",
    online: "Remote",
};

interface RoleSpecificProps {
    role: string;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    subjects: string[];
    setSubjects: (subjects: string[]) => void;
    classLevels: string[];
    setClassLevels: (levels: string[]) => void;
}

export function RoleSpecific({ role, formData, handleInputChange, subjects, setSubjects, classLevels, setClassLevels }: RoleSpecificProps) {
    const isTutor = role === 'tutor';
    const accentColor = isTutor ? 'purple' : 'amber';

    return (
        <div className="space-y-6">
            {/* Experience - Tutor only */}
            {isTutor && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Briefcase className="w-4 h-4" />
                            Years of Experience
                        </label>
                        <Input
                            name="experience"
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <GraduationCap className="w-4 h-4" />
                            Qualification
                        </label>
                        <Input
                            name="qualification"
                            type="text"
                            placeholder="e.g. PhD in Mathematics, Certified Yoga Instructor"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            className="h-14 rounded-2xl border-2 border-gray-200 bg-gray-50/50 px-4 text-base font-medium placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-0 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Mode Selection */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Monitor className="w-4 h-4" />
                    {isTutor ? 'How do you teach?' : 'How do you prefer to learn?'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(['hybrid', 'physical', 'online'] as const).map((mode) => {
                        const Icon = MODE_ICONS[mode];
                        const isSelected = isTutor
                            ? formData.educationMode === mode
                            : formData.learningMode === mode;

                        return (
                            <label
                                key={mode}
                                className={`
                                    relative cursor-pointer rounded-2xl p-4 text-center transition-all
                                    border-2 flex flex-col items-center gap-2
                                    ${isSelected
                                        ? `border-black bg-${accentColor}-50 shadow-neo-sm`
                                        : `border-gray-200 hover:border-${accentColor}-200 hover:bg-gray-50`
                                    }
                                `}
                            >
                                <input
                                    type="radio"
                                    name={isTutor ? 'educationMode' : 'learningMode'}
                                    value={mode}
                                    checked={isSelected}
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center
                                    ${isSelected
                                        ? isTutor ? 'bg-purple-500 text-white' : 'bg-amber-500 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                    }
                                    transition-colors
                                `}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="capitalize font-bold text-sm">{mode}</p>
                                    <p className="text-xs text-gray-400">{MODE_DESCRIPTIONS[mode]}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Class Levels */}
            <ClassLevelSelect
                selectedLevels={classLevels}
                onLevelsChange={setClassLevels}
                label={isTutor ? 'Classes you teach' : 'Your class level'}
                singleSelect={!isTutor}
                showGranular={!isTutor}
            />

            {/* Subjects */}
            <SubjectSelect
                selectedSubjects={subjects}
                onSubjectsChange={setSubjects}
                label={isTutor ? 'Subjects you teach' : 'Subjects you want to learn'}
            />
        </div>
    );
}

