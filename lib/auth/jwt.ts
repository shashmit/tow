import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const ALG = "HS256";

export async function signSessionJWT(payload: { userId: string; role: string; onboardingCompleted: boolean }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime("2h") // Session duration
        .sign(secret);
}

export async function signOnboardingToken(payload: { userId: string; role: string }) {
    return new SignJWT({ ...payload, type: "onboarding" })
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime("15m") // Short lived
        .sign(secret);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: [ALG],
        });
        return payload;
    } catch {
        return null;
    }
}
