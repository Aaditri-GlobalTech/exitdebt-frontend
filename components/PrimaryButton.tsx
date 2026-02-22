"use client";

import React from "react";

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit";
    className?: string;
}

export default function PrimaryButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    type = "button",
    className = "",
}: PrimaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer px-6 py-3 text-base text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            style={{ backgroundColor: "var(--color-purple)" }}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}
