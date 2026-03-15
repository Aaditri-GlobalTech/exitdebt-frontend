"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional fallback UI. If not provided, shows a default error card. */
    fallback?: ReactNode;
    /** Section label for error reporting */
    section?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary for dashboard sections.
 *
 * Catches rendering errors in child components and shows a graceful
 * fallback instead of crashing the entire page. Each dashboard widget
 * should be wrapped in its own ErrorBoundary.
 *
 * Usage:
 *   <ErrorBoundary section="Interest Leak Report">
 *     <InterestLeakReport leak={leak} />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(
            `[ExitDebt] Error in ${this.props.section || "component"}:`,
            error,
            errorInfo
        );
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    className="rounded-2xl p-6 text-center"
                    style={{
                        backgroundColor: "var(--color-bg-card)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <div
                        className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                            backgroundColor: "rgba(220, 38, 38, 0.08)",
                        }}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            style={{ color: "var(--color-danger)" }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <p
                        className="text-sm font-medium mb-1"
                        style={{ color: "var(--color-text-primary)" }}
                    >
                        {this.props.section
                            ? `Unable to load ${this.props.section}`
                            : "Something went wrong"}
                    </p>
                    <p
                        className="text-xs mb-4"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        This section encountered an error. Your other tools are
                        unaffected.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-80 cursor-pointer"
                        style={{
                            backgroundColor: "rgba(115, 0, 190, 0.08)",
                            color: "var(--color-purple)",
                            border: "1px solid rgba(115, 0, 190, 0.15)",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
