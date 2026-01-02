"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "Parent of IB Student",
        text: "The difference was night and day. He didn't just learn Math; he learned how to think. The mentor was like a big brother who happened to be a genius.",
        bg: "bg-blue-100"
    },
    {
        name: "David Chen",
        role: "Physics Tutor (PhD)",
        text: "Tow treats educators with dignity. The matching process is precise. I only work with students I can genuinely help.",
        bg: "bg-pink-100"
    },
    {
        name: "Elena Rodriguez",
        role: "Grade 12 Student",
        text: "I got into my dream school. Not just because of the grades, but the guidance. My mentor helped me draft my personal statement too.",
        bg: "bg-green-100"
    },
    {
        name: "Michael Chang",
        role: "Parent of A-Level Student",
        text: "We tried three other agencies. Tow was the only one that actually listened to our specific needs regarding learning differences.",
        bg: "bg-yellow-100"
    },
    {
        name: "Dr. Alistair Wright",
        role: "History Professor",
        text: "The caliber of students I get through Tow is exceptional. They are curious, prepared, and eager to learn.",
        bg: "bg-purple-100"
    },
    {
        name: "Sophie Turner",
        role: "University Student",
        text: "Survived my first year of Engineering thanks to my Tow mentor. The 24/7 support during exam week was a lifesaver.",
        bg: "bg-orange-100"
    }
];

export function Testimonials() {
    return (
        <section className="w-full py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
                <h2 className="font-serif text-5xl md:text-6xl text-black mb-6">
                    Real Impact.
                </h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                    </div>
                    <span className="font-bold text-black text-sm">4.9/5 Average Rating</span>
                </div>
                <p className="text-black/60 font-medium max-w-xl mx-auto">
                    From ivy league admissions to renewed confidence. Here is what our community has to say.
                </p>
            </div>

            {/* Marquee Row 1 - Left */}
            <div className="relative w-full overflow-hidden mb-12">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-8 w-max"
                    animate={{ x: "-50%" }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {[...reviews, ...reviews].map((review, i) => (
                        <Card key={i} className={`w-[400px] shrink-0 border-2 border-black shadow-neo rounded-2xl overflow-hidden hover:shadow-[8px_8px_0px_0px_black] transition-all hover:-translate-y-1 ${review.bg}`}>
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-black fill-black" />)}
                                    </div>
                                    <Quote className="w-8 h-8 text-black opacity-10 fill-black" />
                                </div>
                                <p className="text-lg font-medium leading-relaxed mb-6 text-black flex-1">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4 border-t-2 border-black/10 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-black shrink-0 relative overflow-hidden">
                                        <Image
                                            src={`https://i.pravatar.cc/150?u=${review.name}`}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm tracking-wide uppercase text-black">{review.name}</h4>
                                        <p className="text-xs font-bold text-black/50 uppercase tracking-wider">{review.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>

            {/* Marquee Row 2 - Right (Slower) */}
            <div className="relative w-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-8 w-max"
                    initial={{ x: "-50%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                    {[...[...reviews].reverse(), ...[...reviews].reverse()].map((review, i) => (
                        <Card key={i} className={`w-[400px] shrink-0 border-2 border-black shadow-neo rounded-2xl overflow-hidden hover:shadow-[8px_8px_0px_0px_black] transition-all hover:-translate-y-1 ${review.bg}`}>
                            <CardContent className="p-8 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-black fill-black" />)}
                                    </div>
                                    <Quote className="w-8 h-8 text-black opacity-10 fill-black" />
                                </div>
                                <p className="text-lg font-medium leading-relaxed mb-6 text-black flex-1">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4 border-t-2 border-black/10 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-black shrink-0 relative overflow-hidden">
                                        <Image
                                            src={`https://i.pravatar.cc/150?u=${review.name}`}
                                            alt={review.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm tracking-wide uppercase text-black">{review.name}</h4>
                                        <p className="text-xs font-bold text-black/50 uppercase tracking-wider">{review.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>
            </div>

        </section>
    );
}
