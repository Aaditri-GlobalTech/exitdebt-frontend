"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function IncomeDetailsForm() {
    const { user, isReady, updateIncome } = useAuth();
    
    const [salary, setSalary] = useState(user?.salary?.toString() || "");
    const [salaryDate, setSalaryDate] = useState(user?.salaryDate?.toString() || "");
    const [otherIncome, setOtherIncome] = useState(user?.otherIncome?.toString() || "0");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Only show if ready and logged in
    if (!isReady || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const numSalary = parseFloat(salary) || 0;
        const numDate = parseInt(salaryDate, 10) || 1;
        const numOther = parseFloat(otherIncome) || 0;

        if (numSalary <= 0) {
            setMessage({ text: "Please enter a valid salary amount.", type: "error" });
            return;
        }

        if (numDate < 1 || numDate > 31) {
            setMessage({ text: "Salary date must be between 1 and 31.", type: "error" });
            return;
        }

        setIsSaving(true);
        try {
            // Optimistically update context
            updateIncome(numSalary, numDate, numOther);

            const res = await fetch("/api/user/income", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salary: numSalary,
                    salary_date: numDate,
                    other_income: numOther
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to update income");
            }

            setMessage({ text: "Income details updated successfully!", type: "success" });
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (err: unknown) {
            setMessage({ text: err instanceof Error ? err.message : "Something went wrong.", type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Income Details</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Keep this updated for accurate debt-to-income analysis.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Salary */}
                    <div className="space-y-1.5 relative">
                        <label className="text-xs font-bold text-gray-700">Monthly Net Salary</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                            <input
                                type="number"
                                required
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3.5 pl-8 font-medium transition-all"
                                placeholder="e.g. 50000"
                            />
                        </div>
                    </div>

                    {/* Salary Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Salary Credit Date</label>
                        <div className="relative">
                            <input
                                type="number"
                                required
                                min="1"
                                max="31"
                                value={salaryDate}
                                onChange={(e) => setSalaryDate(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3.5 pl-4 pr-10 font-medium transition-all"
                                placeholder="e.g. 1"
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">of month</span>
                        </div>
                    </div>

                    {/* Other Income */}
                    <div className="space-y-1.5 relative">
                        <label className="text-xs font-bold text-gray-700">Other Regular Monthly Income</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                            <input
                                type="number"
                                value={otherIncome}
                                onChange={(e) => setOtherIncome(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 block p-3.5 pl-8 font-medium transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="">
                        {message && (
                            <p className={`text-xs font-bold ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm disabled:opacity-70 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : "Save Details"}
                    </button>
                </div>
            </form>
        </div>
    );
}
