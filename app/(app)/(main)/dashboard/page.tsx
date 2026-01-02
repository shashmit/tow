"use client";

import { useDashboard } from "../layout";
import { Award, BookOpen, Clock, Target } from "lucide-react";
import { BookingList } from "@/components/tutor/booking-list";

export default function DashboardPage() {
    const { userDoc } = useDashboard();

    // We don't need to fetch user here anymore, it's done in Layout.
    const isTutor = userDoc?.role === "tutor";

    if (isTutor) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black">My Bookings</h2>
                        <p className="text-gray-500 font-medium">Manage your upcoming sessions</p>
                    </div>
                    {/* Add filters or actions here if needed */}
                </div>

                <BookingList />
            </div>
        );
    }

    // Student View - Progress Tab content
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-neo">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-200 border-2 border-black rounded-lg flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Hours</span>
                    </div>
                    <p className="text-4xl font-black">24.5</p>
                    <p className="text-sm text-gray-500 mt-1">Hours of learning this month</p>
                </div>

                <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-neo">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-200 border-2 border-black rounded-lg flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Sessions</span>
                    </div>
                    <p className="text-4xl font-black">12</p>
                    <p className="text-sm text-gray-500 mt-1">Completed sessions</p>
                </div>

                <div className="bg-white border-2 border-black p-6 rounded-2xl shadow-neo">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-200 border-2 border-black rounded-lg flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Goals Met</span>
                    </div>
                    <p className="text-4xl font-black">85%</p>
                    <p className="text-sm text-gray-500 mt-1">Weekly target achieved</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-neo overflow-hidden">
                <div className="p-6 border-b-2 border-black bg-gray-50">
                    <h2 className="text-xl font-black flex items-center gap-2">
                        <Award size={20} />
                        Recent Activity
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center mb-4">
                            <BookOpen size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No recent sessions yet</p>
                        <p className="text-sm text-gray-400 mt-1">Book your first session to get started</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
