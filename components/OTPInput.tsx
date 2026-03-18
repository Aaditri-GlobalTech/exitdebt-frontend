"use client";

import React, { useState, useRef, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function OTPInput({ length = 6, onComplete, disabled }: OTPInputProps) {
  const [digits, setDigits] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    const val = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      onComplete(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-10 sm:w-12 h-14 text-center text-xl font-bold rounded-lg border focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
          style={{
            backgroundColor: "var(--color-teal-light)",
            borderColor: digit ? "var(--color-teal)" : "transparent",
            color: "var(--color-text-primary)",
          }}
        />
      ))}
    </div>
  );
}
