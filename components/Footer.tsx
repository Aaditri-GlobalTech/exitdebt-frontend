"use client";

export default function Footer() {
    return (
        <footer
            style={{
                backgroundColor: "rgba(252,252,252,0.9)",
                borderTop: "1px solid var(--color-border)",
            }}
        >
            <div className="max-w-6xl mx-auto px-8 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                style={{ backgroundColor: "var(--color-purple)" }}
                            >
                                E
                            </div>
                            <span
                                className="text-base font-bold tracking-tight"
                                style={{ color: "var(--color-text-primary)" }}
                            >
                                ExitDebt
                            </span>
                        </div>
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Understand, restructure, and exit your debt — on your terms.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <p
                            className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Company
                        </p>
                        <div className="space-y-2.5">
                            <a
                                href="#"
                                className="block text-sm transition-colors"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                About us
                            </a>
                            <a
                                href="#"
                                className="block text-sm transition-colors"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="block text-sm transition-colors"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p
                            className="text-xs font-semibold uppercase tracking-wider mb-4"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            Get in touch
                        </p>
                        <div className="space-y-2.5">
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                support@exitdebt.in
                            </p>
                            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                                Mumbai, India
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-10 pt-6"
                    style={{ borderTop: "1px solid var(--color-border)" }}
                >
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        © {new Date().getFullYear()} ExitDebt Technologies Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
