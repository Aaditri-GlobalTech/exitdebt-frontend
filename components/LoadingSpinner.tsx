"use client";

export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-14 gap-5" role="status" aria-label="Loading credit report">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-[3px] border-gray-100" />
                <div
                    className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent animate-spin"
                    style={{ borderTopColor: "var(--accent-teal)" }}
                />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Pulling your credit report...</p>
                <p className="text-xs text-gray-400 mt-1.5">This usually takes a few seconds</p>
            </div>
        </div>
    );
}
