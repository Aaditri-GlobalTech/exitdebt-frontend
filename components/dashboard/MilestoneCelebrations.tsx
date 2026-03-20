/**
 * MilestoneCelebrations.tsx
 * 
 * RS-10 (P1): Milestone Celebrations
 * 
 * Detects notable achievements in the user's debt journey and displays
 * celebratory UI elements:
 *  - Closed/settled accounts
 *  - Score improvements since last check
 *  - Debt balance reductions
 * 
 * When no milestones are detected, the component renders nothing.
 */
"use client";

interface Account {
    lender: string;
    status?: string;
}

interface MilestoneCelebrationsProps {
    /** All user accounts — checks for closed/settled status */
    accounts: Account[];
    /** Current debt health score */
    currentScore: number;
    /** Previous debt health score (from last check) */
    previousScore?: number;
}

/**
 * Derive milestone events from account data and score changes.
 */
function getMilestones(
    accounts: Account[],
    currentScore: number,
    previousScore?: number
): { icon: string; title: string; description: string }[] {
    const milestones: { icon: string; title: string; description: string }[] = [];

    /* Detect closed/settled accounts */
    const closedAccounts = accounts.filter(
        (a) => a.status?.toLowerCase() === "closed" || a.status?.toLowerCase() === "settled"
    );
    if (closedAccounts.length > 0) {
        milestones.push({
            icon: "🎉",
            title: `${closedAccounts.length} Account${closedAccounts.length > 1 ? "s" : ""} Closed!`,
            description: `You've successfully closed ${closedAccounts.map((a) => a.lender).join(", ")}. Great progress!`,
        });
    }

    /* Detect score improvements */
    if (previousScore !== undefined && currentScore > previousScore) {
        const improvement = currentScore - previousScore;
        milestones.push({
            icon: "🚀",
            title: `Score Up by ${improvement} Points!`,
            description: `Your debt health improved from ${previousScore} to ${currentScore} since your last check.`,
        });
    }

    /* Detect healthy score threshold */
    if (currentScore >= 80) {
        milestones.push({
            icon: "🏆",
            title: "Healthy Debt Score!",
            description: "Your debt structure is well-managed. Keep it up!",
        });
    }

    return milestones;
}

export default function MilestoneCelebrations({ accounts, currentScore, previousScore }: MilestoneCelebrationsProps) {
    const milestones = getMilestones(accounts, currentScore, previousScore);

    /* Don't render if there are no milestones to celebrate */
    if (milestones.length === 0) return null;

    return (
        <div className="space-y-3 animate-fadeIn">
            {milestones.map((m, i) => (
                <div
                    key={i}
                    className="rounded-2xl p-5 flex items-center gap-4 border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm"
                >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {m.icon}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">{m.title}</h4>
                        <p className="text-xs text-gray-500">{m.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
