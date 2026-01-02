"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// --- Types ---

export type Role = "tutor" | "student";

interface AuthContextType {
    // User/Session state (can be expanded later)
    isAuthenticated: boolean;
    setIsAuthenticated: (val: boolean) => void;

    // Temporary state for signup/onboarding flow
    pendingRole: Role | null;
    setPendingRole: (role: Role | null) => void;
    pendingEmail: string | null;
    setPendingEmail: (email: string | null) => void;

    // Helper to clear pending state after onboarding
    clearPendingAuth: () => void;
}

// --- Context ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider ---

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pendingRole, setPendingRole] = useState<Role | null>(null);
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);

    const clearPendingAuth = () => {
        setPendingRole(null);
        setPendingEmail(null);
    };

    const value: AuthContextType = {
        isAuthenticated,
        setIsAuthenticated,
        pendingRole,
        setPendingRole,
        pendingEmail,
        setPendingEmail,
        clearPendingAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// --- Hook ---

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
