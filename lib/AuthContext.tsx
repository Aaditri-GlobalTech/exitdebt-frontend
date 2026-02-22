"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { MockProfile } from "@/lib/mockProfiles";
import { selectProfile, hashPAN } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface ConsentRecord {
    timestamp: string;   // ISO 8601
    version: string;     // Consent text version
}

interface AuthState {
    user: MockProfile | null;
    isLoggedIn: boolean;
    pan: string;          // Raw PAN — in memory only, NEVER stored
    panHash: string;      // SHA-256 hash — stored in cookie
    phone: string;
    isReady: boolean;
    consent: ConsentRecord | null;
}

interface AuthContextType extends AuthState {
    login: (pan: string, phone: string) => void;
    updateIncome: (salary: number, salaryDate: number, otherIncome?: number) => void;
    refreshData: () => void;
    logout: () => void;
}

/* ─── Cookie Helpers ─────────────────────────────────────────────────────── */

const COOKIE_NAME = "exidebt_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — auto-expire
const CONSENT_VERSION = "1.0";             // Bump when consent text changes

function setCookie(data: Record<string, unknown>) {
    if (typeof document === "undefined") return;
    const value = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
}

function getCookie(): Record<string, unknown> | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    try {
        return JSON.parse(decodeURIComponent(match[1]));
    } catch {
        return null;
    }
}

function deleteCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    pan: "",
    panHash: "",
    phone: "",
    isReady: false,
    consent: null,
    login: () => { },
    updateIncome: () => { },
    refreshData: () => { },
    logout: () => { },
});

/* ─── Provider ───────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockProfile | null>(null);
    const [pan, setPan] = useState("");         // Raw PAN — memory only
    const [panHash, setPanHash] = useState("");  // SHA-256 — persisted
    const [phone, setPhone] = useState("");
    const [consent, setConsent] = useState<ConsentRecord | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Hydrate from cookie on mount
    useEffect(() => {
        const data = getCookie();
        if (data && data.panHash && data.phone) {
            // We have a hashed PAN in cookie — need raw PAN to select profile
            // If rawPan was stored temporarily for session, use it
            const rawPan = (data.rawPanForSession as string) || "";
            if (rawPan) {
                const profile = selectProfile(rawPan);
                // Restore income if saved
                if (data.salary) {
                    profile.salary = data.salary as number;
                    profile.salaryDate = (data.salaryDate as number) || 1;
                    profile.otherIncome = (data.otherIncome as number) || 0;
                }
                setUser(profile);
                setPan(rawPan);
            }
            setPanHash(data.panHash as string);
            setPhone(data.phone as string);
            if (data.consent) {
                setConsent(data.consent as ConsentRecord);
            }
        }
        setIsReady(true);
    }, []);

    // Persist to cookie on state change
    useEffect(() => {
        if (!isReady) return;
        if (user && panHash) {
            setCookie({
                panHash,             // SHA-256 hash only
                rawPanForSession: pan, // Needed for profile selection on reload
                phone,
                salary: user.salary,
                salaryDate: user.salaryDate,
                otherIncome: user.otherIncome,
                consent,
            });
        } else {
            deleteCookie();
        }
    }, [user, pan, panHash, phone, consent, isReady]);

    const login = useCallback((panValue: string, phoneValue: string) => {
        const normalizedPan = panValue.toUpperCase();
        const profile = selectProfile(normalizedPan);
        setUser(profile);
        setPan(normalizedPan);
        setPhone(phoneValue);

        // Record consent
        setConsent({
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
        });

        // Hash PAN asynchronously for storage
        hashPAN(normalizedPan).then((hash) => {
            setPanHash(hash);
        });
    }, []);

    const updateIncome = useCallback(
        (salary: number, salaryDate: number, otherIncome?: number) => {
            setUser((prev) =>
                prev ? { ...prev, salary, salaryDate, otherIncome: otherIncome ?? 0 } : prev
            );
        },
        []
    );

    const refreshData = useCallback(() => {
        if (pan) {
            const profile = selectProfile(pan);
            setUser((prev) =>
                prev ? { ...profile, salary: prev.salary, salaryDate: prev.salaryDate, otherIncome: prev.otherIncome } : profile
            );
        }
    }, [pan]);

    const logout = useCallback(() => {
        setUser(null);
        setPan("");
        setPanHash("");
        setPhone("");
        setConsent(null);
        deleteCookie();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                pan,
                panHash,
                phone,
                isReady,
                consent,
                login,
                updateIncome,
                refreshData,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/* ─── Hook ───────────────────────────────────────────────────────────────── */

export function useAuth() {
    return useContext(AuthContext);
}
