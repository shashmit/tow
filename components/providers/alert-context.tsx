"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { DynamicAlert, AlertType } from "@/components/ui/dynamic-alert";

interface AlertContextType {
    showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<AlertType>("info");
    const [timerId, setTimerId] = useState<NodeJS.Timeout | number | null>(null);

    const showAlert = useCallback((msg: string, alertType: AlertType = "info") => {
        // Clear existing timer if any
        if (timerId) clearTimeout(timerId as any);

        setMessage(msg);
        setType(alertType);
        setIsVisible(true);

        // Auto-hide after 4 seconds
        const id = setTimeout(() => {
            setIsVisible(false);
        }, 4000);
        setTimerId(id);
    }, [timerId]);

    const closeAlert = () => setIsVisible(false);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <DynamicAlert
                isVisible={isVisible}
                message={message}
                type={type}
                onClose={closeAlert}
            />
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}
