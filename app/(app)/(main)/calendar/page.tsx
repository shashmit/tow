
"use client";

import { useEffect, useState, useMemo } from "react";
import { Loader2, Plus, X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAlert } from "@/components/providers/alert-context";
import { PageLoader } from "@/components/ui/page-loader";

// Types
type DayMode = "online" | "offline" | "hybrid" | "half" | "close";
type SlotType = "online" | "offline";
type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

interface Slot {
    start: string;
    type: SlotType;
}

interface DaySchedule {
    dayOfWeek: DayOfWeek;
    mode: DayMode;
    slots: Slot[];
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
    { dayOfWeek: "monday", mode: "close", slots: [] },
    { dayOfWeek: "tuesday", mode: "close", slots: [] },
    { dayOfWeek: "wednesday", mode: "close", slots: [] },
    { dayOfWeek: "thursday", mode: "close", slots: [] },
    { dayOfWeek: "friday", mode: "close", slots: [] },
    { dayOfWeek: "saturday", mode: "close", slots: [] },
    { dayOfWeek: "sunday", mode: "close", slots: [] },
];

function getNext7Days() {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        // Clean day name for matching: 'Monday', 'Tuesday' -> 'monday'
        const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
        // Display string: e.g. "Fri, Jan 2"
        const displayDate = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        days.push({
            date: nextDate,
            dayOfWeek: dayName,
            label: i === 0 ? `Today, ${displayDate}` : displayDate // Highlight Today
        });
    }
    return days;
}

export default function CalendarPage() {
    const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
    const [educationMode, setEducationMode] = useState<string>("hybrid");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showAlert } = useAlert();

    const next7Days = useMemo(() => getNext7Days(), []);

    // Fetch Schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch("/api/tutor/availability");
                if (!res.ok) throw new Error("Failed to fetch schedule");
                const data = await res.json();

                if (data.schedule && data.schedule.length > 0) {
                    setSchedule(prev => prev.map(day => {
                        const found = data.schedule.find((d: any) => d.dayOfWeek === day.dayOfWeek);
                        return found ? { ...found } : day;
                    }));
                }
                if (data.educationMode) {
                    setEducationMode(data.educationMode);
                }
            } catch (err) {
                console.error(err);
                showAlert("Could not load your schedule.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    // Find the Schedule State index given a dayOfWeek
    const getScheduleIndex = (day: DayOfWeek) => schedule.findIndex(s => s.dayOfWeek === day);

    const handleModeChange = (targetDay: DayOfWeek, newMode: DayMode) => {
        const dayIndex = getScheduleIndex(targetDay);
        if (dayIndex === -1) return;

        setSchedule(prev => {
            const newSchedule = [...prev];
            newSchedule[dayIndex] = { ...newSchedule[dayIndex], mode: newMode, slots: [] };
            return newSchedule;
        });
    };

    const addSlot = (targetDay: DayOfWeek) => {
        setSchedule(prev => {
            const dayIndex = prev.findIndex(s => s.dayOfWeek === targetDay);
            if (dayIndex === -1) return prev;

            const currentDay = prev[dayIndex];
            const total = currentDay.slots.length;

            if (currentDay.mode === 'close') return prev;
            if (currentDay.mode === 'half' && total >= 2) return prev;
            if (['online', 'offline', 'hybrid'].includes(currentDay.mode) && total >= 5) return prev;

            let newType: SlotType = 'online';
            if (currentDay.mode === 'offline') newType = 'offline';
            if (educationMode === 'physical' && currentDay.mode !== 'offline') newType = 'offline';

            const newSchedule = [...prev];
            newSchedule[dayIndex] = {
                ...currentDay,
                slots: [...currentDay.slots, { start: "09:00", type: newType }]
            };
            return newSchedule;
        });
    };


    const removeSlot = (targetDay: DayOfWeek, slotIndex: number) => {
        setSchedule(prev => {
            const dayIndex = prev.findIndex(s => s.dayOfWeek === targetDay);
            if (dayIndex === -1) return prev;

            const currentDay = prev[dayIndex];
            const newSlots = [...currentDay.slots];
            newSlots.splice(slotIndex, 1);

            const newSchedule = [...prev];
            newSchedule[dayIndex] = {
                ...currentDay,
                slots: newSlots
            };
            return newSchedule;
        });
    };


    const updateSlot = (targetDay: DayOfWeek, slotIndex: number, field: keyof Slot, value: string) => {
        setSchedule(prev => {
            const dayIndex = prev.findIndex(s => s.dayOfWeek === targetDay);
            if (dayIndex === -1) return prev;

            const currentDay = prev[dayIndex];
            const newSlots = [...currentDay.slots];
            newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };

            const newSchedule = [...prev];
            newSchedule[dayIndex] = {
                ...currentDay,
                slots: newSlots
            };
            return newSchedule;
        });
    };


    const saveSchedule = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/tutor/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schedule }),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.error) throw new Error(data.error);
                if (data.details) throw new Error(JSON.stringify(data.details));
                throw new Error("Failed to save");
            }
            showAlert("Schedule saved successfully!", "success");
        } catch (err: any) {
            showAlert(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <PageLoader />
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">

            {/* Render based on Rolling 7 Days */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {next7Days.map((dateObj, i) => {
                    const daySchedule = schedule.find(s => s.dayOfWeek === dateObj.dayOfWeek) || {
                        dayOfWeek: dateObj.dayOfWeek,
                        mode: "close" as DayMode,
                        slots: []
                    };

                    return (
                        <DayCard
                            key={i}
                            dateLabel={dateObj.label}
                            day={daySchedule}
                            educationMode={educationMode}
                            onModeChange={handleModeChange}
                            onAddSlot={addSlot}
                            onRemoveSlot={removeSlot}
                            onUpdateSlot={updateSlot}
                        />
                    );
                })}
            </div>

            <div className="flex justify-end pt-6 border-t-2 border-gray-100 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
                <Button
                    type="button"
                    onClick={saveSchedule}
                    disabled={saving}
                    className="h-14 px-8 rounded-2xl font-bold text-base bg-black text-white hover:scale-105 transition-all shadow-neo hover:shadow-none hover:bg-emerald-500 hover:text-black hover:border-black border-2 border-transparent"
                >
                    {saving ? "Saving..." : "Save Changes"}
                    {!saving && <Save className="ml-2 h-5 w-5" />}
                </Button>
            </div>
        </div>
    );
}

function DayCard({
    dateLabel, day, educationMode, onModeChange, onAddSlot, onRemoveSlot, onUpdateSlot
}: {
    dateLabel: string,
    day: DaySchedule,
    educationMode: string,
    onModeChange: (d: DayOfWeek, m: DayMode) => void,
    onAddSlot: (d: DayOfWeek) => void,
    onRemoveSlot: (d: DayOfWeek, si: number) => void,
    onUpdateSlot: (d: DayOfWeek, si: number, f: keyof Slot, v: string) => void
}) {
    const isClose = day.mode === 'close';
    const isHybrid = day.mode === 'hybrid';

    // Limits
    const maxSlots = day.mode === 'half' ? 2 : (isClose ? 0 : 5);
    const canAdd = day.slots.length < maxSlots;

    return (
        <div className={cn(
            "border-2 border-black rounded-3xl p-6 transition-all",
            isClose ? "bg-gray-50 opacity-75" : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
        )}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-serif text-2xl font-bold">{dateLabel}</h3>
                </div>

                {/* Native Select for Mode */}
                <div className="relative">
                    <select
                        value={day.mode}
                        onChange={(e) => onModeChange(day.dayOfWeek, e.target.value as DayMode)}
                        className="appearance-none bg-white border-2 border-black font-bold h-10 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-0"
                    >
                        {/* Always show Close and Half */}
                        <option value="close">Close Day</option>
                        <option value="half">Half Day</option>

                        {/* Filtered Options */}
                        {(educationMode === 'online' || educationMode === 'hybrid') && (
                            <option value="online">Online Only</option>
                        )}
                        {(educationMode === 'physical' || educationMode === 'hybrid') && (
                            <option value="offline">Offline Only</option>
                        )}
                        {educationMode === 'hybrid' && (
                            <option value="hybrid">Hybrid</option>
                        )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="space-y-3 min-h-[100px]">
                {day.slots.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 font-medium italic text-sm py-8 border-2 border-dashed border-gray-200 rounded-xl">
                        {isClose ? "No sessions scheduled" : "No slots added yet"}
                    </div>
                )}
                <AnimatePresence>
                    {day.slots.map((slot, slotIndex) => (
                        <motion.div
                            key={slotIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-100 group hover:border-black transition-colors"
                        >
                            <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) => onUpdateSlot(day.dayOfWeek, slotIndex, 'start', e.target.value)}
                                className="w-32 bg-white border-2 border-gray-200 font-mono font-bold focus:border-black rounded-lg"
                            />

                            {(day.mode === 'hybrid' || day.mode === 'half') ? (
                                <div className="relative flex-1">
                                    <select
                                        value={slot.type}
                                        onChange={(e) => onUpdateSlot(day.dayOfWeek, slotIndex, 'type', e.target.value as SlotType)}
                                        className="w-full appearance-none bg-white border-2 border-gray-200 font-bold h-10 pl-3 pr-8 rounded-lg focus:outline-none focus:border-black"
                                    >
                                        <option value="online">Online (50m)</option>
                                        <option value="offline">Offline (80m)</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 px-4 font-bold text-sm text-gray-500 uppercase tracking-wider">
                                    {slot.type} ({slot.type === 'online' ? '50m' : '80m'})
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveSlot(day.dayOfWeek, slotIndex)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Validation / Info Messages */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {day.slots.length} / {maxSlots} Slots
                </div>
                {canAdd && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAddSlot(day.dayOfWeek)}
                        className="text-black hover:bg-yellow-100 font-bold rounded-lg"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Slot
                    </Button>
                )}
            </div>

            {/* Hybrid Helper */}
            {isHybrid && (
                <div className="mt-3 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide p-2 rounded-lg text-center">
                    Must have 1 Online & 1 Offline. (If 5 slots: 2+3 or 3+2)
                </div>
            )}
        </div>
    );
}
