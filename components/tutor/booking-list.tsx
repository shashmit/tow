"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, User, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Student {
    name: string;
    classLevels: string[];
    subjects: string[];
    email?: string;
    gender?: string;
}

interface Booking {
    $id: string;
    date: string; // YYYY-MM-DD
    startTime: string;
    endTime: string;
    type: "online" | "offline";
    status: "confirmed" | "cancelled" | "completed";
    student: Student;
}

export function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBookings() {
            try {
                const res = await fetch("/api/bookings");
                if (!res.ok) {
                    throw new Error("Failed to fetch bookings");
                }
                const data = await res.json();
                setBookings(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBookings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-500 font-bold">Error loading bookings</p>
                <p className="text-sm text-red-400">{error}</p>
                <Button
                    variant="outline"
                    className="mt-4 border-red-200 hover:bg-red-100"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-bold text-lg">No upcoming bookings</p>
                <p className="text-gray-400 text-sm mt-1">When students book a session, they will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
                <div
                    key={booking.$id}
                    className="bg-white border-2 border-black rounded-2xl p-5 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-hover transition-all duration-200"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Date Column */}
                        <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:justify-start gap-2 md:w-24 bg-gray-50 rounded-xl p-3 border-2 border-gray-100 text-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                {format(new Date(booking.date), "MMM")}
                            </span>
                            <span className="text-3xl font-black text-gray-900 leading-none">
                                {format(new Date(booking.date), "d")}
                            </span>
                            <span className="text-xs font-bold text-gray-500 uppercase">
                                {format(new Date(booking.date), "EEE")}
                            </span>
                        </div>

                        {/* Content Column */}
                        <div className="flex-grow space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        {booking.student.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="border-2 border-black text-black font-bold bg-yellow-100 rounded-md">
                                            {booking.startTime} - {booking.endTime}
                                        </Badge>
                                        <Badge variant="outline" className={`border-2 border-black font-bold rounded-md ${booking.type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {booking.type === 'online' ? <Video size={14} className="mr-1" /> : <MapPin size={14} className="mr-1" />}
                                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="sm:text-right">
                                    <div className="inline-block px-3 py-1 bg-emerald-100 border-2 border-emerald-500 text-emerald-700 text-xs font-black uppercase rounded-full">
                                        {booking.status}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 w-full" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-start gap-2">
                                    <User size={16} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-gray-500">Class Level:</span>
                                        <div className="font-semibold">
                                            {booking.student.classLevels.length > 0
                                                ? booking.student.classLevels.join(", ")
                                                : "Not specified"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-4 mt-0.5 flex justify-center text-gray-400">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-500">Gender:</span>
                                        <div className="font-semibold capitalize">
                                            {booking.student.gender || "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-4 mt-0.5 flex justify-center text-gray-400">
                                        <span className="font-serif italic font-bold">S</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-500">Subjects:</span>
                                        <div className="font-semibold">
                                            {booking.student.subjects.length > 0
                                                ? booking.student.subjects.join(", ")
                                                : "Not specified"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
