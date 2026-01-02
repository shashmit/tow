"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Wifi, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Slot {
    start: string;
    type: "online" | "offline";
    booked?: boolean;
}

export interface DaySchedule {
    dayOfWeek: string;
    slots: Slot[];
    mode?: string;
    date?: string; // Added date field
}

interface CalendarViewProps {
    availability: DaySchedule[];
    onSelectSlot: (date: string, time: string, type: "online" | "offline") => void;
    selectedSlot?: { date: string; time: string };
}

export function CalendarView({
    availability,
    onSelectSlot,
    selectedSlot,
}: CalendarViewProps) {
    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            date: d,
            dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
            dateString: d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            isoString: d.toISOString().split("T")[0],
        };
    });

    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    const currentDay = dates[selectedDateIndex];
    // Find availability matching strict date, or fallback to dayOfWeek (legacy support)
    const dayAvailability = availability.find(
        (a) => a.date === currentDay.isoString || (!a.date && a.dayOfWeek.toLowerCase() === currentDay.dayName.toLowerCase())
    );

    return (
        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-neo">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <span className="bg-yellow-300 border-2 border-black rounded-lg px-2 py-1 text-sm">
                    Step 1
                </span>
                Select a Time
            </h3>

            {/* Date Scroller */}
            <div className="relative mb-8">
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2 border-black hover:bg-gray-100"
                        onClick={() =>
                            setSelectedDateIndex((prev) => Math.max(0, prev - 1))
                        }
                        disabled={selectedDateIndex === 0}
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="font-bold text-lg">
                        {currentDay.dayName}, {currentDay.dateString}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2 border-black hover:bg-gray-100"
                        onClick={() =>
                            setSelectedDateIndex((prev) =>
                                Math.min(dates.length - 1, prev + 1)
                            )
                        }
                        disabled={selectedDateIndex === dates.length - 1}
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-between">
                    {dates.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDateIndex(index)}
                            className={cn(
                                "flex flex-col items-center justify-center w-14 h-20 rounded-xl border-2 transition-all duration-200 flex-shrink-0",
                                selectedDateIndex === index
                                    ? "bg-black border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    : "bg-white border-gray-300 text-gray-500 hover:border-black hover:text-black"
                            )}
                        >
                            <span className="text-xs font-bold uppercase">
                                {date.dayName.slice(0, 3)}
                            </span>
                            <span className="text-lg font-black">
                                {date.date.getDate()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dayAvailability && dayAvailability.slots.length > 0 ? (
                    dayAvailability.slots.map((slot, idx) => {
                        const isSelected =
                            selectedSlot?.date === currentDay.isoString &&
                            selectedSlot?.time === slot.start;
                        const isBooked = slot.booked;

                        return (
                            <button
                                key={`${slot.start}-${idx}`}
                                onClick={() =>
                                    !isBooked && onSelectSlot(currentDay.isoString, slot.start, slot.type)
                                }
                                disabled={isBooked}
                                className={cn(
                                    "relative py-3 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2",
                                    isBooked
                                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-emerald-100 border-emerald-600 text-emerald-800 shadow-neo-sm"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-black hover:shadow-neo-sm"
                                )}
                            >
                                <span className="flex items-center gap-1">
                                    {slot.type === "online" ? <Wifi size={12} /> : <MapPin size={12} />}
                                    {slot.start}
                                </span>
                                {isSelected && (
                                    <div className="absolute top-1 right-1 text-emerald-600">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                )}
                            </button>
                        );
                    })
                ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        No slots available on this day
                    </div>
                )}
            </div>
        </div>
    );
}
