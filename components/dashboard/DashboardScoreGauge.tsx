"use client";

import { useEffect, useState } from "react";

interface DashboardScoreGaugeProps {
    score: number;
    label: string;
    color: "red" | "orange" | "yellow" | "green";
}

const ARC_COLORS: Record<string, string> = {
    red: "#DC2626",
    orange: "#D97706",
    yellow: "#CA8A04",
    green: "#059669",
};

const SCORE_MESSAGES: Record<string, string> = {
    Critical: "Your debt structure needs immediate restructuring.",
    "Needs Attention": "Your debt is costing you more than necessary.",
    Fair: "There's room to optimize and save.",
    Good: "Your debt structure is well-managed.",
};

export default function DashboardScoreGauge({ score, label, color }: DashboardScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const arcColor = ARC_COLORS[color];

    useEffect(() => {
        let current = 0;
        const step = score / 60;
        const interval = setInterval(() => {
            current += step;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(interval);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, 16);
        return () => clearInterval(interval);
    }, [score]);

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = (animatedScore / 100) * circumference;
    const dashOffset = circumference - progress;

    return (
        <div
            className="rounded-2xl p-8 text-center animate-scaleIn"
            style={{
                backgroundColor: "var(--color-bg-card)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.05)",
                border: "1px solid var(--color-border)",
            }}
        >
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--color-text-muted)" }}>
                Debt Health Score
            </p>
            <div className="flex justify-center mb-4">
                <div className="relative w-52 h-52">
                    <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="10" strokeLinecap="round" />
                        <circle cx="90" cy="90" r={radius} fill="none" stroke={arcColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transition: "stroke-dashoffset 0.03s linear" }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{animatedScore}</span>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>/100</span>
                    </div>
                </div>
            </div>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: `${arcColor}15`, color: arcColor }}>
                {label}
            </span>
            <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--color-text-secondary)" }}>
                {SCORE_MESSAGES[label] || ""}
            </p>
        </div>
    );
}
