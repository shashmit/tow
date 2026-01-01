"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Globe, Clock } from "lucide-react";

export function PhilosophySection() {
    return (
        <section className="w-full py-32 bg-white relative overflow-hidden px-4 md:px-6 border-t-2 border-black" id="philosophy">

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    className="mb-20 text-center max-w-4xl mx-auto"
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true }}
                >
                    <span className="bg-purple-200 px-4 py-1.5 border-2 border-black shadow-neo-sm rounded-full text-xs font-bold uppercase tracking-widest text-black mb-6 inline-block">
                        The Hybrid Advantage
                    </span>
                    <h2 className="font-serif text-5xl md:text-7xl mb-6 leading-[0.9] text-black">
                        Best of both worlds. <br />
                        <span className="text-black/40 italic">Literally.</span>
                    </h2>
                    <p className="text-xl font-medium text-black/70 max-w-2xl mx-auto">
                        Why choose between the comfort of home and the expertise of the world? With Tow, you get both.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Card 1: In-Person (Local) */}
                    <motion.div
                        className="relative min-h-[600px] rounded-[2rem] overflow-hidden border-2 border-black shadow-neo bg-emerald-50 group flex flex-col justify-between p-8 md:p-12 hover:bg-emerald-100 transition-colors"
                        whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #000' }}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MapPin className="w-64 h-64 text-emerald-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-300 border-2 border-black rounded-2xl flex items-center justify-center mb-8 shadow-neo-sm">
                                <MapPin className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="font-serif text-4xl mb-4 text-black">At Your Table.</h3>
                            <p className="text-lg font-medium text-black/80 leading-relaxed max-w-md mb-8">
                                If your perfect mentor is nearby, they come to you. Real connection, physical presence, and the focus that comes from sitting side-by-side.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                    Comfort of learning from home
                                </li>
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-2 h-2 rounded-full bg-black" />
                                    Structured physical materials
                                </li>
                            </ul>
                        </div>

                        <div className="relative mt-auto">
                            <div className="bg-white border-2 border-black p-4 rounded-xl shadow-neo-sm flex items-center gap-4 mb-6 transform -rotate-1">
                                <div className="bg-black text-white p-2 rounded-lg">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Flexibility Guarantee</h4>
                                    <p className="text-xs font-bold text-black/60">Not comfy? Change your tutor instantly.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Online (Global) */}
                    <motion.div
                        className="relative min-h-[600px] rounded-[2rem] overflow-hidden border-2 border-black shadow-neo bg-blue-50 group flex flex-col justify-between p-8 md:p-12 hover:bg-blue-100 transition-colors"
                        whileHover={{ y: -4, boxShadow: '8px 8px 0px 0px #000' }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Globe className="w-64 h-64 text-blue-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-300 border-2 border-black rounded-2xl flex items-center justify-center mb-8 shadow-neo-sm">
                                <Globe className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="font-serif text-4xl mb-4 text-black">On Your Screen.</h3>
                            <p className="text-lg font-medium text-black/80 leading-relaxed max-w-md mb-8">
                                Live too far? No problem. Connect with Oxford graduates and industry experts from anywhere.
                            </p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 border border-black" />
                                    100+ Tutors always online
                                </li>
                                <li className="flex items-center gap-3 font-bold text-black/70">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 border border-black" />
                                    Instant doubt resolution
                                </li>
                            </ul>
                        </div>

                        <div className="relative h-48 w-full mt-auto rounded-xl border-2 border-black overflow-hidden bg-white shadow-sm">
                            <Image
                                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1000&auto=format&fit=crop"
                                alt="Online tutoring"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute bottom-4 right-4 bg-green-400 border-2 border-black px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm animate-pulse">
                                ● Live Now
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
