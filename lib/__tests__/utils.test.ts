/**
 * Unit tests for utility functions.
 *
 * Covers:
 *   - validatePAN (PAN format validation)
 *   - validatePhone (Indian mobile number validation)
 *   - formatCurrency (Indian locale currency formatting)
 *   - calculateSavings (single-account overpayment)
 *   - selectProfile (mock profile selection and score calculation)
 */

import {
    validatePAN,
    validatePhone,
    formatCurrency,
    calculateSavings,
    selectProfile,
} from "../utils";

/* ═════════════════════════════════════════════════════════════════════════ */
/*  validatePAN                                                             */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("validatePAN", () => {
    it("accepts valid PAN format (ABCDE1234F)", () => {
        expect(validatePAN("ABCDE1234F")).toBe(true);
        expect(validatePAN("XYZPQ9876R")).toBe(true);
    });

    it("accepts lowercase input (auto-uppercases)", () => {
        expect(validatePAN("abcde1234f")).toBe(true);
    });

    it("accepts input with leading/trailing spaces", () => {
        expect(validatePAN("  ABCDE1234F  ")).toBe(true);
    });

    it("rejects invalid formats", () => {
        expect(validatePAN("ABCDE1234")).toBe(false); // too short
        expect(validatePAN("12345ABCDE")).toBe(false); // wrong order
        expect(validatePAN("ABCDE12345")).toBe(false); // last char is digit
        expect(validatePAN("A1CDE1234F")).toBe(false); // digit in letter section
        expect(validatePAN("")).toBe(false); // empty
        expect(validatePAN("ABCDEFGHIJ")).toBe(false); // no digits
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  validatePhone                                                           */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("validatePhone", () => {
    it("accepts valid Indian mobile numbers", () => {
        expect(validatePhone("9876543210")).toBe(true);
        expect(validatePhone("6000000000")).toBe(true);
        expect(validatePhone("7999999999")).toBe(true);
        expect(validatePhone("8123456789")).toBe(true);
    });

    it("handles whitespace", () => {
        expect(validatePhone(" 9876543210 ")).toBe(true);
    });

    it("rejects numbers not starting with 6-9", () => {
        expect(validatePhone("5876543210")).toBe(false);
        expect(validatePhone("1234567890")).toBe(false);
        expect(validatePhone("0876543210")).toBe(false);
    });

    it("rejects wrong length", () => {
        expect(validatePhone("98765")).toBe(false); // too short
        expect(validatePhone("98765432101")).toBe(false); // too long
        expect(validatePhone("")).toBe(false); // empty
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  formatCurrency                                                          */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("formatCurrency", () => {
    it("formats with ₹ symbol", () => {
        const result = formatCurrency(1000);
        expect(result).toContain("₹");
    });

    it("formats using Indian locale grouping", () => {
        // Indian: ₹1,00,000  (not ₹100,000)
        const result = formatCurrency(100000);
        expect(result).toBe("₹1,00,000");
    });

    it("formats zero", () => {
        expect(formatCurrency(0)).toBe("₹0");
    });

    it("formats small amounts", () => {
        expect(formatCurrency(500)).toBe("₹500");
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  calculateSavings                                                        */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("calculateSavings", () => {
    it("calculates yearly overpayment correctly", () => {
        // outstanding=200000, apr=24, optimal=12
        // savings = 200000 * (24 - 12) / 100 = 24000
        expect(calculateSavings(200000, 24, 12)).toBe(24000);
    });

    it("returns 0 when APR is at or below optimal", () => {
        expect(calculateSavings(100000, 12, 12)).toBe(0);
        expect(calculateSavings(100000, 10, 12)).toBe(0);
    });

    it("rounds to nearest integer", () => {
        // 100000 * (15 - 12) / 100 = 3000 (exact)
        expect(calculateSavings(100000, 15, 12)).toBe(3000);
    });
});

/* ═════════════════════════════════════════════════════════════════════════ */
/*  selectProfile                                                           */
/* ═════════════════════════════════════════════════════════════════════════ */

describe("selectProfile", () => {
    it("matches known PAN hash (Saurabh → abcde1234f)", () => {
        const profile = selectProfile("abcde1234f");
        expect(profile.name).toBe("Saurabh");
    });

    it("returns a deterministic fallback for unknown PAN", () => {
        const p1 = selectProfile("zzzzz9999z");
        const p2 = selectProfile("zzzzz9999z");
        expect(p1.name).toBe(p2.name);
    });

    it("populates score and scoreLabel dynamically", () => {
        const profile = selectProfile("abcde1234f");
        expect(profile.score).toBeGreaterThanOrEqual(0);
        expect(profile.score).toBeLessThanOrEqual(100);
        expect(profile.scoreLabel).toBeTruthy();
    });

    it("populates color as a valid value", () => {
        const profile = selectProfile("abcde1234f");
        expect(["red", "orange", "yellow", "green"]).toContain(profile.color);
    });

    it("calculates overpayment dynamically", () => {
        const profile = selectProfile("abcde1234f");
        expect(typeof profile.overpayment).toBe("number");
        expect(profile.overpayment).toBeGreaterThanOrEqual(0);
    });
});
