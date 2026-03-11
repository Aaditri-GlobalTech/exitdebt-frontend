"use client";

import ShieldSidebar from "@/components/dashboard/ShieldSidebar";
import SubscriptionGate from "@/components/SubscriptionGate";
import { useState } from "react";

export default function AccountsPage() {
    return (
        <SubscriptionGate requiredTier="shield">
            <div className="flex bg-[#F8FAFC] min-h-screen">
                <ShieldSidebar />
                
                <main className="flex-1 px-8 py-10 h-screen overflow-y-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                        <span>Shield Protection</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-teal-500">Request Communication</span>
                    </div>

                    <div className="mb-10 max-w-2xl">
                        <h2 className="text-3xl font-extrabold text-[#0F172A] mb-3 leading-tight">Request Creditor Communication</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Our legal and negotiation team will step in to handle all future interactions with your creditor, protecting your peace of mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Request Form Area */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Select Debt Account</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer">
                                            <option>Choose an active account...</option>
                                            <option>HDFC Bank Credit Card - ₹1,12,450.00</option>
                                            <option>ICICI Bank Loan - ₹82,200.00</option>
                                            <option>SBI Card - ₹1,15,000.00</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Reason for Request</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Payment Plan Negotiation",
                                            "Stop Harassment Calls",
                                            "Settlement Offer",
                                            "Interest Rate Reduction"
                                        ].map((reason) => (
                                            <label key={reason} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-teal-500/30 transition-all cursor-pointer group">
                                                <input type="checkbox" className="w-5 h-5 rounded border-slate-200 text-teal-600 focus:ring-teal-500/20" />
                                                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{reason}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Additional Context or Specific Instructions</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all h-32 resize-none"
                                        placeholder="E.g. They recently called my workplace, I have a preferred settlement amount of ₹30,000..."
                                    />
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <label className="flex gap-4 cursor-pointer">
                                        <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20" />
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            I hereby authorize <span className="font-bold text-[#0F172A]">ExitDebt</span> and its legal representatives to act as my designated agent for all communications regarding the selected account. This includes the authority to negotiate terms, request documentation, and receive notices on my behalf.
                                        </p>
                                    </label>
                                </div>

                                <button className="w-full py-4 rounded-2xl bg-teal-500 text-white font-extrabold text-sm shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    Submit Request
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <h4 className="flex items-center gap-3 text-sm font-extrabold text-[#0F172A] mb-8">
                                    <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                    Shield Benefits
                                </h4>
                                <div className="space-y-6">
                                    {[
                                        { title: "Legal Representation", desc: "Vetted attorneys handle your high-stakes negotiations.", icon: "⚖️" },
                                        { title: "Reduced Stress", desc: "No more direct phone calls or harassment from creditors.", icon: "😊" },
                                        { title: "Professional Negotiation", desc: "Industry experts work to lower your debt balances.", icon: "🤝" }
                                    ].map((benefit) => (
                                        <div key={benefit.title} className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">{benefit.icon}</div>
                                            <div>
                                                <h5 className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">{benefit.title}</h5>
                                                <p className="text-[11px] text-slate-500 leading-tight">{benefit.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="agent" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="agent" />
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Agents Online</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-extrabold text-[#0F172A] mb-8">Process Timeline</h4>
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                                    {[
                                        { step: "01", title: "Reviewing Request", desc: "Legal team reviews within 2-4 hours.", status: "active" },
                                        { step: "02", title: "Notice of Appearance", desc: "Formal notice sent to your creditor.", status: "pending" },
                                        { step: "03", title: "Negotiation Active", desc: "Full representation established.", status: "pending" }
                                    ].map((item) => (
                                        <div key={item.step} className="relative pl-10">
                                            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                item.status === 'active' ? 'bg-teal-500 text-white outline outline-4 outline-teal-50' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {item.step}
                                            </div>
                                            <div>
                                                <h5 className={`text-[11px] font-bold mb-1 ${item.status === 'active' ? 'text-[#0F172A]' : 'text-slate-400'}`}>{item.title}</h5>
                                                <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Support Status Teaser */}
                    <div className="mt-10 p-6 rounded-3xl bg-teal-50/30 border border-teal-100/30 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">Support Status</p>
                            <h4 className="text-sm font-bold text-[#0F172A]">2 Active Negotiators Assigned</h4>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    </div>
                </main>
            </div>
        </SubscriptionGate>
    );
}
