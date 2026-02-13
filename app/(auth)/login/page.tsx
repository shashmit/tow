"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

import { DotMatrixBackground } from "@/components/ui/dot-matrix";
import { PageLoader } from "@/components/ui/page-loader";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { checkEmail as checkEmailStr, login, register, getSession } from "@/lib/auth/client";
import { useAuth } from "@/components/providers/auth-context";
import { useAlert } from "@/components/providers/alert-context";


export default function LoginPage() {
    const [isTutor, setIsTutor] = useState(false);
    const { setPendingRole, setPendingEmail } = useAuth();

    // 'email' -> detection phase, 'password' -> completion phase
    const [step, setStep] = useState<"email" | "password">("email");
    const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");

    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [isLoadingSession, setIsLoadingSession] = useState(true); // Start true to check session

    // Use the alert context hook
    const { showAlert } = useAlert();

    // Check for existing session on mount
    useEffect(() => {
        const checkExistingSession = async () => {
            const session = await getSession();
            if (session.authenticated && session.onboardingCompleted) {
                // User has completed onboarding, redirect to dashboard
                router.replace("/dashboard");
            } else if (session.authenticated && !session.onboardingCompleted) {
                // User hasn't completed onboarding, redirect to onboarding
                router.replace("/onboarding");
            } else {
                // No valid session, show login form
                setIsLoadingSession(false);
            }
        };
        checkExistingSession();
    }, [router]);

    const checkEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return;

        setPending(true);
        setError(null);

        try {
            const res = await checkEmailStr(formData.email);

            if (res.exists) {
                // Auto-switch role if needed
                if (res.role === 'tutor' && !isTutor) {
                    setIsTutor(true);
                } else if (res.role === 'student' && isTutor) {
                    setIsTutor(false);
                }

                setFlow("signIn");
                showAlert("Welcome back! Please enter your password.", "success");
            } else {
                setFlow("signUp");
                showAlert("New account! Create a password to get started.", "info");
            }
            setStep("password");
        } catch (err: any) {
            const errorMsg = err.message || "Failed to check email";
            setError(errorMsg);
            showAlert(errorMsg, "error");
        } finally {
            setPending(false);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setError(null);

        try {
            if (flow === 'signUp') {
                if (!agreeToTerms) {
                    showAlert("Please agree to the Terms of Service and Privacy Policy to continue.", "error");
                    setPending(false);
                    return;
                }
                await register(formData.email, formData.password, isTutor ? 'tutor' : 'student');
                // After register, auto login
            }

            const res = await login(formData.email, formData.password);

            setIsLoadingSession(true);
            showAlert(flow === 'signUp' ? "Account created successfully!" : "Login successful!", "success");

            // Redirect based on onboarding status
            setTimeout(() => {
                if (res.onboardingRequired) {
                    // Set pending auth data in context instead of URL params
                    setPendingRole(isTutor ? 'tutor' : 'student');
                    setPendingEmail(formData.email);
                    router.push('/onboarding');
                } else {
                    router.push('/dashboard');
                }
            }, 1000);

        } catch (err: any) {
            const errorMsg = err.message || "Authentication failed";
            setError(errorMsg);
            showAlert(errorMsg, "error");
            setPending(false);
        }
    };

    const resetFlow = () => {
        setStep("email");
        setError(null);
        setFormData(prev => ({ ...prev, password: "" }));
        setAgreeToTerms(false);
    };

    if (isLoadingSession) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-[#FFFDF8] flex flex-col relative overflow-hidden font-sans selection:bg-black selection:text-white">
            {/* Background Decorative Elements */}
            <DotMatrixBackground />

            {/* Nav Link */}
            <div className="absolute top-8 left-8 z-20">
                <Link
                    href="/"
                    className="group flex items-center gap-2 font-bold text-sm text-black hover:underline underline-offset-4"
                >
                    <div className="bg-white border-2 border-black rounded-full p-2 transition-transform group-hover:-translate-x-1 shadow-neo">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Home
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 pt-24 md:p-8 z-10">
                {/* Main Card Container */}
                <div className="w-full max-w-[1400px] bg-white border-2 border-black rounded-[2rem] shadow-neo-xl overflow-hidden flex flex-col md:flex-row relative md:min-h-[800px]">

                    {/* Animated Layout Container */}
                    <div className="relative md:absolute md:inset-0 flex flex-col md:flex-row w-full h-full">

                        {/* Left Panel (Image/Content) */}
                        <motion.div
                            layout
                            className={`w-full md:w-1/2 min-h-[300px] md:min-h-full relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black flex items-center justify-center p-8 md:p-12 transition-colors duration-500 ease-in-out
                ${isTutor
                                    ? "md:order-2 md:border-l-2 md:border-r-0 bg-purple-400"
                                    : "md:order-1 bg-yellow-400"
                                }
              `}
                            transition={{ type: "spring", stiffness: 180, damping: 24 }}
                        >
                            {/* Pulsating Dot Animation */}
                            <div className="absolute top-6 right-6 md:top-12 md:right-12">
                                <div className="relative flex items-center justify-center">
                                    <div className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${isTutor ? 'bg-white' : 'bg-black'}`}></div>
                                    <div className={`relative w-4 h-4 rounded-full ${isTutor ? 'bg-white' : 'bg-black'}`}></div>
                                </div>
                            </div>


                            <AnimatePresence mode="wait">
                                {isTutor ? (
                                    <motion.div
                                        key="tutor-image"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="text-center space-y-4 md:space-y-8 max-w-lg relative z-10 px-4 md:px-8"
                                    >
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                                            Share Your<br />Wisdom.
                                        </h2>
                                        <p className="font-medium text-lg md:text-xl text-white/90 leading-relaxed">
                                            "Teaching is the greatest act of optimism." <br /> Join the community.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="student-image"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="text-center space-y-4 md:space-y-8 max-w-lg relative z-10 px-4 md:px-8"
                                    >
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-[0.9]">
                                            Start Your<br />Journey.
                                        </h2>
                                        <p className="font-medium text-lg md:text-xl text-black/80 leading-relaxed">
                                            The expert you need is just one click away. <br /> Learn faster, together.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Abstract Pattern Background */}
                            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px]"></div>
                        </motion.div>


                        {/* Right Panel (Login Form) */}
                        <motion.div
                            layout
                            className={`w-full md:w-1/2 min-h-[500px] md:min-h-full bg-white flex flex-col justify-center p-6 md:p-24 lg:p-32 relative
                 ${isTutor ? "md:order-1" : "md:order-2"}
              `}
                            transition={{ type: "spring", stiffness: 180, damping: 24 }}
                        >
                            {/* Background decoration */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute top-[-100px] ${isTutor ? 'left-[-100px] bg-purple-200' : 'right-[-100px] bg-yellow-200'} w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none`}
                            />

                            <div className="max-w-md mx-auto w-full space-y-10 relative z-10">
                                <div className="space-y-3">
                                    <motion.div
                                        layout="position"
                                        className="flex items-baseline gap-3"
                                    >
                                        <h1 className="text-5xl font-black tracking-tighter">
                                            {step === 'password' && flow === 'signUp' ? "Create Account" : (isTutor ? "Tutor Portal" : "Student Login")}
                                        </h1>
                                        <div className={`h-3 w-3 rounded-full ${isTutor ? 'bg-purple-500' : 'bg-yellow-500'} animate-pulse`} />
                                    </motion.div>
                                    <p className="text-lg text-gray-500 font-medium">
                                        {step === 'password' && flow === 'signUp'
                                            ? "Set a password to get started."
                                            : (isTutor ? "Manage your sessions and students." : "Access your learning dashboard.")}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Google Auth - Only show on email step */}
                                    {step === 'email' && (
                                        <>
                                            <Button
                                                className={`w-full h-14 bg-white text-black border-2 border-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 text-lg font-bold ${isTutor ? "hover:bg-purple-300" : "hover:bg-yellow-300"}`}
                                                onClick={() => console.log(isTutor ? "Tutor Google Login" : "Student Google Login")}
                                            >
                                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path
                                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                        fill="#4285F4"
                                                    />
                                                    <path
                                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                        fill="#34A853"
                                                    />
                                                    <path
                                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                        fill="#FBBC05"
                                                    />
                                                    <path
                                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                        fill="#EA4335"
                                                    />
                                                </svg>
                                                Continue with Google
                                            </Button>

                                            <div className="relative py-2">
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="w-full border-t-2 border-gray-100" />
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                                    <span className="bg-white px-4 text-gray-400 font-bold">Or continue with email</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <form onSubmit={step === 'email' ? checkEmail : handleAuth} className="space-y-4">
                                        <div className="space-y-4">
                                            {/* Email Input */}
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className={`pl-12 h-12 border-2 text-base transition-all
                                                        ${step === 'password'
                                                            ? 'bg-gray-100 border-gray-200 text-gray-500' // Read-only look
                                                            : 'bg-gray-50/50 border-gray-200 focus:border-black focus:ring-0'
                                                        } rounded-xl`}
                                                    required
                                                    readOnly={step === 'password'}
                                                />
                                                {step === 'password' && (
                                                    <button
                                                        type="button"
                                                        onClick={resetFlow}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>

                                            {/* Password Input - Only shown in step 2 */}
                                            {step === 'password' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="space-y-4"
                                                >
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                                                        <Input
                                                            type="password"
                                                            name="password"
                                                            placeholder="Password"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className="pl-12 h-12 border-2 border-gray-200 focus:border-black focus:ring-0 rounded-xl bg-gray-50/50 text-base"
                                                            required
                                                            minLength={8}
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {/* Terms Checkbox - Only for Sign Up */}
                                                    {flow === 'signUp' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-start gap-3 p-1"
                                                        >
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id="terms"
                                                                    checked={agreeToTerms}
                                                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-black checked:bg-black hover:border-black"
                                                                />
                                                                <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" size={12} strokeWidth={4} />
                                                            </div>
                                                            <label htmlFor="terms" className="text-sm font-medium text-gray-500 cursor-pointer select-none">
                                                                I agree to the <a href="#" className="text-black underline">Terms of Service</a> and <a href="#" className="text-black underline">Privacy Policy</a>.
                                                            </label>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>

                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm font-bold text-center"
                                            >
                                                {error}
                                            </motion.p>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={pending}
                                            className={`w-full h-12 bg-white text-black border-2 border-black rounded-xl font-bold text-lg shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${isTutor ? 'hover:bg-purple-300' : 'hover:bg-yellow-300'} disabled:opacity-50 flex items-center justify-center gap-2`}
                                        >
                                            {pending ? "Loading..." : (
                                                step === 'email' ? (
                                                    <>
                                                        Continue <ArrowRight size={20} />
                                                    </>
                                                ) : (
                                                    flow === 'signIn' ? "Log In" : "Sign Up"
                                                )
                                            )}
                                        </Button>
                                    </form>

                                    <div className="pt-6 text-center">
                                        <p className="text-base font-medium text-gray-500 mb-3">
                                            {isTutor ? "Looking to learn instead?" : "Ready to share your expertise?"}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setIsTutor(!isTutor);
                                                // Optional: Reset flow on role switch? 
                                                // resetFlow();
                                            }}
                                            className={`text-base font-black underline underline-offset-4 decoration-2 transition-all ${isTutor ? 'decoration-purple-300 hover:text-purple-600' : 'decoration-yellow-300 hover:text-yellow-600'}`}
                                        >
                                            {isTutor ? "Log in as a Student" : "Are you a Tutor?"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </div>
    );
}
