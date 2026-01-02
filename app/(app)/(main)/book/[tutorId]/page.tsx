"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarView, DaySchedule } from "@/components/booking/calendar-view";
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useDashboard } from "../../layout";
import { Tutor } from "@/lib/tutors";


export default function BookSessionPage() {
    const params = useParams();
    const router = useRouter();
    const { userDoc } = useDashboard();
    const tutorId = params.tutorId as string;

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [availability, setAvailability] = useState<DaySchedule[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedSlot, setSelectedSlot] = useState<{
        date: string;
        time: string;
        type: "online" | "offline";
    }>();
    const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Tutor Profile
                const profileRes = await fetch(`/api/tutors/${tutorId}`);
                if (!profileRes.ok) throw new Error("Failed to fetch tutor");
                const profileData = await profileRes.json();

                const mappedTutor: Tutor = {
                    id: profileData.$id,
                    name: profileData.name || "Unknown Tutor",
                    subjects: profileData.subjects || [],
                    role: profileData.role || "Tutor",
                    exp: profileData.experience || "N/A",
                    methods: profileData.educationMode ? [profileData.educationMode] : ["Hybrid"],
                    rate: profileData.rate ? `$${profileData.rate}/hr` : "N/A",
                    rating: profileData.rating || 5.0,
                    reviews: profileData.reviews || 0,
                    image: profileData.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
                    bio: profileData.bio || "",
                    featured: profileData.featured || false,
                    classLevels: profileData.classLevels || [],
                    availability: []
                };
                setTutor(mappedTutor);

                // Fetch Availability
                const availRes = await fetch(`/api/tutor/availability?tutorId=${tutorId}`);
                if (availRes.ok) {
                    const availData = await availRes.json();
                    if (availData.schedule) {
                        setAvailability(availData.schedule);
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (tutorId) {
            fetchData();
        }
    }, [tutorId]);

    const handleBookSession = async () => {
        if (!selectedSlot || !tutor) return;

        setBookingStatus("loading");
        try {
            const dateObj = new Date(selectedSlot.date);
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

            // Calculate end time (assuming 1 hour for now, or based on type)
            // Ideally should depend on session duration logic
            const [hours, minutes] = selectedSlot.time.split(":").map(Number); // Naive parsing for example
            // If AM/PM logic needed, need better parsing.
            // Assuming time is stored in a format we can just send back.

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorId: tutor.id,
                    date: selectedSlot.date,
                    startTime: selectedSlot.time,
                    endTime: selectedSlot.time, // Placeholder, backend logic should really handle duration
                    type: selectedSlot.type,
                    dayOfWeek: dayName
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Booking failed");
            }

            setBookingStatus("success");
            // toast.success("Booking confirmed!");
        } catch (error: any) {
            console.error("Booking failed:", error);
            // toast.error(error.message);
            setBookingStatus("error");
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!tutor) {
        return <div>Tutor not found</div>;
    }

    if (bookingStatus === "success") {
        return (
            <div className="max-w-2xl mx-auto pt-10 px-4">
                <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-neo text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500 text-emerald-600">
                        <CheckCircle size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Your session with <span className="font-bold text-black">{tutor.name}</span> has been confirmed for <span className="font-bold text-black">{selectedSlot?.date}</span> at <span className="font-bold text-black">{selectedSlot?.time}</span>.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Button
                            className="rounded-xl font-bold h-12 px-8"
                            onClick={() => router.push("/dashboard")}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header / Nav */}
            <div className="mb-8">
                <Link href="/tutor">
                    <Button variant="outline" size="sm" className="rounded-xl border-2 border-black bg-white hover:bg-gray-50 shadow-sm font-bold">
                        <ChevronLeft size={16} className="mr-1" /> Back to Tutors
                    </Button>
                </Link>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white border-2 border-black rounded-3xl p-6 md:p-8 shadow-neo mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Clock size={120} />
                </div>

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-2 border-black shadow-neo overflow-hidden bg-gray-100">
                            <img
                                src={tutor.image}
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 py-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-3xl md:text-4xl font-black">{tutor.name}</h1>
                                    <span className="bg-yellow-200 border-2 border-black px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                        {tutor.exp} Exp
                                    </span>
                                </div>
                                <p className="text-xl text-gray-600 font-bold mb-4">{tutor.role}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tutor.subjects?.map((subject: string) => (
                                        <span key={subject} className="px-3 py-1 bg-black text-white text-xs rounded-full font-bold">
                                            {subject}
                                        </span>
                                    ))}
                                    {tutor.classLevels?.map((level: string) => (
                                        <span key={level} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-bold border-2 border-blue-200">
                                            Classes {level}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="bg-emerald-50 border-2 border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-600 uppercase">Hourly Rate</p>
                                        <p className="text-2xl font-black text-emerald-900">{tutor.rate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="space-y-6">
                    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-neo">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                            About Me
                        </h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {tutor.bio}
                        </p>
                    </div>

                    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-neo">
                        <h3 className="text-xl font-black mb-4">Teaching Info</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-bold">Rating</span>
                                <span className="font-black flex items-center gap-1">
                                    {tutor.rating} <span className="text-yellow-500 text-lg">★</span>
                                    <span className="text-gray-400 font-medium text-xs ml-1">({tutor.reviews} reviews)</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-500 font-bold">Methods</span>
                                <div className="flex gap-1">
                                    {tutor.methods?.map((m: string) => (
                                        <span key={m} className="text-xs bg-gray-100 px-2 py-1 rounded font-bold">{m}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking */}
                <div className="lg:col-span-2 space-y-6">
                    <CalendarView
                        availability={availability}
                        onSelectSlot={(date, time, type) => setSelectedSlot({ date, time, type })}
                        selectedSlot={selectedSlot}
                    />

                    {/* Booking Details / Confirmation helper - Only shows when slot selected */}
                    {selectedSlot ? (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl border-2 border-blue-100 text-blue-600">
                                    <CalendarIcon size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Selected Time</p>
                                    <p className="font-black text-lg text-blue-900">{selectedSlot.date} @ {selectedSlot.time} ({selectedSlot.type})</p>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="w-full sm:w-auto rounded-xl font-bold border-2 border-black shadow-neo active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                onClick={handleBookSession}
                                disabled={bookingStatus === "loading"}
                            >
                                {bookingStatus === "loading" ? "Booking..." : "Confirm Booking"}
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
                            <p className="font-bold">Select a time slot above to proceed with booking</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
