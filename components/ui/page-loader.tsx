"use client";

import { DotMatrixBackground } from "@/components/ui/dot-matrix";

export function PageLoader() {
    return (
        <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center relative overflow-hidden">
            <DotMatrixBackground />
            <div className="bg-white p-4 rounded-full shadow-neo border-2 border-black z-10 animate-fade-in">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </div>
    );
}
