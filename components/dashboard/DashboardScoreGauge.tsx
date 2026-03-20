"use client";

import { useEffect, useState } from "react";

interface DashboardScoreGaugeProps {
    score: number;
    label: string;
    color: "red" | "orange" | "yellow" | "green";
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; alert: string }> = {
    Critical: { bg: "#FEF2F2", text: "#DC2626", alert: "Red Alert: High interest leakage detected." },
    "Needs Attention": { bg: "#FFF7ED", text: "#EA580C", alert: "Your debt-to-income ratio is in the critical zone. Let's look at ways to optimize." },
    Fair: { bg: "#FEFCE8", text: "#CA8A04", alert: "You're managing, but significant interest savings are possible." },
    Good: { bg: "var(--color-teal-light)", text: "var(--color-teal)", alert: "Your debt health is stable. Keep optimizing or settle for total freedom." },
};

export default function DashboardScoreGauge({ score, label, color }: DashboardScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const config = STATUS_CONFIG[label] || STATUS_CONFIG["Needs Attention"];

    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentScore = Math.floor(progress * score);
            setAnimatedScore(currentScore);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    // SVG parameters for the ring
    const size = 180;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div
            className="rounded-xl p-6 lg:p-7 flex flex-col items-center justify-center text-center animate-fadeIn border border-gray-100 flex-1 h-full"
            style={{ backgroundColor: "var(--color-bg-card)", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}
        >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
                Debt Health Score
            </p>

            <div className="relative mb-6">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background Ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#F3F4F6"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress Ring */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="var(--color-teal)"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
                {/* Score Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
                    <span className="text-6xl font-bold text-gray-800 tabular-nums">
                        {animatedScore}
                    </span>
                    <span className="text-sm font-semibold text-gray-400">
                        out of 100
                    </span>
                </div>
                {/* Glowing Dot at tip of progress (optional but premium) */}
                <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 border border-white shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </div>

            <div 
                className="inline-block px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border"
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.text,
                    borderColor: `${config.text}20`
                }}
            >
                {label}
            </div>

            <p className="text-[11px] leading-relaxed text-gray-500 max-w-[200px] font-medium">
                {config.alert}
            </p>
        </div>
    );
}
