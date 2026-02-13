export async function checkEmail(email: string) {
    const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Failed to check email");
    return res.json();
}

export async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
    }
    return res.json();
}

export async function register(email: string, password: string, role: string) {
    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
    }
    return res.json();
}

export interface SessionInfo {
    authenticated: boolean;
    onboardingCompleted?: boolean;
    userId?: string;
    role?: string;
}

export async function getSession(): Promise<SessionInfo> {
    try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) return { authenticated: false };
        return res.json();
    } catch {
        return { authenticated: false };
    }
}

export async function logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
}
