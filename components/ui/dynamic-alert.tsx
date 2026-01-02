"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, X } from "lucide-react";

export type AlertType = 'success' | 'error' | 'info';

interface DynamicAlertProps {
    isVisible: boolean;
    message: string;
    type: AlertType;
    onClose: () => void;
}

export function DynamicAlert({ isVisible, message, type, onClose }: DynamicAlertProps) {
    // Auto-dismiss logic handled in provider usually, but we can double check here or just rely on parent.
    // For "Dynamic Island" feel, distinct animations:
    // 1. Scale/Expand from center
    // 2. Shake on error (optional, but nice)

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="pointer-events-auto bg-black text-white rounded-full shadow-2xl flex items-center gap-3 py-3 pl-4 pr-3 min-w-[300px] max-w-md border border-white/10"
                    >
                        {/* Icon Container */}
                        <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full
                            ${type === 'error' ? 'bg-red-500/20 text-red-500' : ''}
                            ${type === 'success' ? 'bg-green-500/20 text-green-500' : ''}
                            ${type === 'info' ? 'bg-blue-500/20 text-blue-500' : ''}
                        `}>
                            {type === 'error' && <AlertCircle size={18} strokeWidth={2.5} />}
                            {type === 'success' && <CheckCircle size={18} strokeWidth={2.5} />}
                            {type === 'info' && <AlertCircle size={18} strokeWidth={2.5} />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 mr-2">
                            <p className="text-sm font-medium leading-tight">{message}</p>
                        </div>

                        {/* Close Button (optional, but good for UX) */}
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={16} className="text-white/60" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
