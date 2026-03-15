/**
 * Skeleton loading placeholder components.
 * Used while data is being fetched to prevent layout shift
 * and provide visual feedback.
 */

interface SkeletonProps {
    className?: string;
}

/** Generic rectangular skeleton bar */
export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`rounded-lg animate-pulse ${className}`}
            style={{ backgroundColor: "rgba(148, 163, 184, 0.12)" }}
        />
    );
}

/** Card-shaped skeleton (for dashboard widgets) */
export function SkeletonCard({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`rounded-2xl p-6 space-y-4 ${className}`}
            style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
            }}
        >
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>
    );
}

/** Score gauge skeleton (circular shape) */
export function SkeletonGauge() {
    return (
        <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
            style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
            }}
        >
            <div
                className="w-40 h-40 rounded-full animate-pulse"
                style={{ backgroundColor: "rgba(148, 163, 184, 0.12)" }}
            />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-32" />
        </div>
    );
}

/** Row skeleton (for account lists) */
export function SkeletonRow() {
    return (
        <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
            }}
        >
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-6 w-16 shrink-0" />
        </div>
    );
}
