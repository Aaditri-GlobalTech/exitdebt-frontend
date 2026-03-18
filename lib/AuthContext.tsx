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
    userId: string;       // Backend UUID — persisted in cookie
    isReady: boolean;
    consent: ConsentRecord | null;
}

interface AuthContextType extends AuthState {
    login: (pan: string, phone: string, backendData?: Record<string, any>) => void;
    onboardUser: (userId: string, name: string, phone: string) => void;
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
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict; Secure`;
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
    userId: "",
    isReady: false,
    consent: null,
    login: () => { },
    onboardUser: () => { },
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
    const [userId, setUserId] = useState("");   // Backend UUID — persisted
    const [consent, setConsent] = useState<ConsentRecord | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Hydrate from cookie on mount
    useEffect(() => {
        const data = getCookie();
        if (data && data.panHash && data.phone) {
            // Match profile by panHash
            const { mockProfiles } = require("./mockProfiles");
            const profile = mockProfiles.find(
                (p: { panHash: string }) => p.panHash === data.panHash
            );
            
            if (profile) {
                // Restore values if saved
                if (data.salary !== undefined) {
                    profile.salary = data.salary as number;
                    profile.salaryDate = (data.salaryDate as number) || 1;
                    profile.otherIncome = (data.otherIncome as number) || 0;
                }
                if (data.isEmailVerified !== undefined) {
                    profile.isEmailVerified = data.isEmailVerified as boolean;
                }
                setUser(profile);
            } else if (data.name) {
                // Create a temporary profile for newly onboarded user
                setUser({
                    name: data.name as string,
                    panHash: data.panHash as string,
                    score: 0,
                    scoreLabel: "Pending Analysis",
                    color: "yellow",
                    totalOutstanding: 0,
                    monthlyEmi: 0,
                    activeAccounts: 0,
                    avgInterestRate: 0,
                    creditUtilization: 0,
                    missedPayments: 0,
                    accounts: [],
                    overpayment: 0,
                    optimalRate: 0,
                    salary: (data.salary !== undefined ? data.salary : 0) as number,
                    salaryDate: (data.salaryDate as number) || 1,
                    otherIncome: (data.otherIncome as number) || 0,
                    isEmailVerified: (data.isEmailVerified as boolean) || false,
                    currentTimeline: "Pending",
                    optimizedTimeline: "Pending",
                    timelineSaved: "Pending",
                    creditScore: 0
                });
            } else {
                setUser(mockProfiles[0]); // fallback
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
                panHash,             // SHA-256 hash only — NEVER store raw PAN
                phone,
                userId,              // Backend UUID for API calls
                name: user.name,     // Persist name for onboarding flow
                salary: user.salary,
                salaryDate: user.salaryDate,
                otherIncome: user.otherIncome,
                isEmailVerified: user.isEmailVerified,
                consent,
            });
        } else {
            deleteCookie();
        }
    }, [user, pan, panHash, phone, userId, consent, isReady]);

    const login = useCallback((panValue: string, phoneValue: string, backendData?: Record<string, any>) => {
        const normalizedPan = panValue.toUpperCase();
        
        let profile: MockProfile;
        
        if (backendData?.name) {
            // Real backend login — create profile with the user's actual data
            profile = {
                name: backendData.name,
                panHash: "",  // Will be set via hashPAN below
                isEmailVerified: backendData.is_email_verified || false,
                score: 0,
                scoreLabel: "Loading...",
                color: "yellow",
                totalOutstanding: 0,
                monthlyEmi: 0,
                activeAccounts: 0,
                avgInterestRate: 0,
                creditUtilization: 0,
                missedPayments: 0,
                accounts: [],
                overpayment: 0,
                optimalRate: 0,
                salary: backendData.salary || 0,
                salaryDate: backendData.salary_date || 1,
                otherIncome: backendData.other_income || 0,
                currentTimeline: "Pending",
                optimizedTimeline: "Pending",
                timelineSaved: "Pending",
                creditScore: 0,
            };
        } else {
            // Fallback: mock profile selection (legacy flow)
            profile = selectProfile(normalizedPan);
        }
        setUser(profile);
        setPan(normalizedPan);
        setPhone(phoneValue);
        if (backendData?.user_id) setUserId(backendData.user_id);


        // Record consent
        setConsent({
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
        });

        // Hash PAN for storage
        hashPAN(normalizedPan).then((hash) => {
            setPanHash(hash);
        });
    }, []);

    const onboardUser = useCallback((userId: string, name: string, phoneValue: string) => {
        setUser({
            name,
            panHash: userId,
            isEmailVerified: false,
            score: 0,
            scoreLabel: "Welcome!",
            color: "yellow",
            totalOutstanding: 0,
            monthlyEmi: 0,
            activeAccounts: 0,
            avgInterestRate: 0,
            creditUtilization: 0,
            missedPayments: 0,
            accounts: [],
            overpayment: 0,
            optimalRate: 0,
            salary: 0,
            salaryDate: 1,
            otherIncome: 0,
            currentTimeline: "Pending",
            optimizedTimeline: "Pending",
            timelineSaved: "Pending",
            creditScore: 0
        });
        setPan("ONBOARDING");
        setPanHash(userId);
        setPhone(phoneValue);
        setUserId(userId);
        
        setConsent({
            timestamp: new Date().toISOString(),
            version: CONSENT_VERSION,
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
        setUserId("");
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
                userId,
                isReady,
                consent,
                login,
                onboardUser,
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
