"use client";

import { useEffect, useRef } from "react";

export function DotMatrixBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const draw = () => {
            time += 0.005; // Very slow time increment for "calm" feel
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const spacing = 30; // Space between dots
            const dotSize = 1.5; // Base radius of dots

            const cols = Math.ceil(canvas.width / spacing);
            const rows = Math.ceil(canvas.height / spacing);

            ctx.fillStyle = "#A0A0A0"; // Neutral gray for the dots

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;

                    // Create a wave effect based on position and time
                    // Using sine waves to create gentle pulsing
                    const wave = Math.sin(x * 0.01 + y * 0.01 + time) * 0.5 + 0.5;
                    const wave2 = Math.cos(x * 0.02 - y * 0.02 + time * 0.5) * 0.3;

                    // opacity varies between 0.1 and 0.4 for subtlety
                    const opacity = 0.05 + (wave + wave2) * 0.25;

                    ctx.beginPath();
                    ctx.globalAlpha = opacity;
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}
