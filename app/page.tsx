"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingToggle from "@/components/PricingToggle";
import PricingCard from "@/components/PricingCard";
import FAQAccordion from "@/components/FAQAccordion";

/* ───── Data ───── */

const STEPS = [
  { num: "1", title: "Tell Us About Your Debt", desc: "Quick and confidential — just your name, phone, and total debt amount. No credit score checks.", icon: "/PAN3.svg" },
  { num: "2", title: "Book a Free Call", desc: "Choose a time that works for you. Our expert debt advisor will call to discuss your options.", icon: "/credit assessment.svg" },
  { num: "3", title: "Get a Plan", desc: "Receive a personalized debt reduction strategy — consolidation, negotiation, or restructuring.", icon: "/plan.svg" },
];

const TRUST_POINTS = [
  { icon: "iso", title: "ISO 27001 Certified", desc: "Adhering to global standards for information security management systems." },
  { icon: "calls", title: "No Sales Calls", desc: "We respect your privacy. No unwanted marketing calls or spam, ever." },
  { icon: "encrypted", title: "Encrypted Storage", desc: "Personal information is encrypted using AES-256 before being stored in our secure servers." },
  { icon: "privacy", title: "Bank-Grade Privacy", desc: "We follow the same stringent security protocols as major financial institutions." },
];

const LANDING_FAQS = [
  { question: "Is this really free?", answer: "Yes, our Basic dashboard and debt health assessment are 100% free forever. It includes your Debt Health Score, Debt Summary, Interest Leak Report, and Salary Day Cash Flow analysis." },
  { question: "How do you make money?", answer: "We offer premium subscription tiers (Lite and Shield) for advanced intelligence tools, continuous monitoring, and active harassment protection. For complex cases, our Shield+ service provides full debt negotiation for a performance fee." },
  { question: "Is my PAN data safe?", answer: "Absolutely. We use bank-grade AES-256 encryption. We only use your PAN to fetch your credit report once you provide explicit consent, and we never share your raw PAN details." },
  { question: "Will this affect my credit score?", answer: "No, we perform a \"soft pull\" on your credit record which does not impact your Equifax or other bureau credit scores in any way." },
];



/* ───── Component ───── */

/* ───── Components ───── */
const TypingText = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [isStarted, text]);

  return (
    <h3 ref={containerRef} className={className} style={{ color: "var(--color-text-primary)" }}>
      {displayedText}
      {isStarted && displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-10 lg:h-12 bg-[var(--color-teal)] ml-2 animate-pulse align-middle" />
      )}
    </h3>
  );
};

export default function LandingPage() {

  const [isAnnual, setIsAnnual] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const formCardRef = useRef<HTMLDivElement>(null);

  // Glow effect
  useEffect(() => {
    function triggerGlow() {
      if (formCardRef.current) {
        formCardRef.current.classList.add("form-glow-active");
        setTimeout(() => formCardRef.current?.classList.remove("form-glow-active"), 2000);
      }
    }
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a[href*="#start"]')) setTimeout(triggerGlow, 100);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <Navbar />

      {/* ───── HERO ───── */}
      <section id="start" style={{ backgroundColor: "var(--color-bg)" }} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center text-left">
            {/* Left — Headline */}
            <div className="lg:col-span-7 animate-fadeIn">
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6"
                style={{ backgroundColor: "var(--color-teal-light)", color: "var(--color-teal-dark)" }}
              >
                <span className="mr-1.5 min-w-[12px] min-h-[12px] inline-flex items-center justify-center rounded-full bg-teal-600 text-[8px] text-white">✓</span> Trusted by 50,000+ Users
              </div>

              <h1
                className="text-5xl lg:text-[4rem] font-bold leading-[1.05] tracking-tight mb-8"
                style={{ color: "var(--color-text-primary)" }}
              >
                Are you <span style={{ color: "var(--color-teal)" }}>overpaying</span><br />
                on your loans?
              </h1>

              <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: "var(--color-text-secondary)" }}>
                Take control of your financial future. Our industry experts help you
                find hidden savings and create a personalized debt reduction plan
                tailored to your situation.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>NO CREDIT IMPACT</span>
                </div>
              </div>
            </div>

            {/* Right — CTA Card */}
            <div className="lg:col-span-5 animate-slideUp stagger-1">
              <div className="flex flex-col items-center text-center py-4">
                <img 
                  src="/question2.svg" 
                  alt="Get Started" 
                  className="w-72 h-72 sm:w-80 sm:h-80 lg:w-full lg:h-[400px] mb-12 object-contain drop-shadow-sm transition-transform duration-700 pointer-events-none select-none" 
                />
                <div className="space-y-8 w-full max-w-sm">
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                      {isLoggedIn ? `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!` : 'Ready to get debt-free?'}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      Talk to our expert debt advisors for free. No credit score checks, no complicated forms — just a simple conversation about your options.
                    </p>
                  </div>
                  <Link
                    href="/get-started"
                    className="w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-lg font-black text-white transition-all hover:shadow-2xl hover:shadow-teal-100/50 active:scale-[0.98] bg-[var(--color-teal)] tracking-tight group"
                  >
                    Get Started — It&apos;s Free
                    <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300 leading-none pb-0.5">›</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="steps" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>How It Works</h2>
        </div>
        <div className="relative space-y-32 lg:space-y-48">
          {/* Subtle connecting path (hidden on mobile) */}
          <div className="hidden lg:block absolute left-1/2 top-40 bottom-40 w-0.5 border-l-2 border-dashed border-teal-100 -translate-x-1/2 -z-10" />

          {STEPS.map((s, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div 
                key={s.num} 
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-32 px-4 group`}
              >
                {/* Visual Anchor */}
                <div className="flex-1 relative w-full flex justify-center">
                  {/* Organic Blob Background */}
                  <div className={`absolute -inset-20 bg-[var(--color-teal)] opacity-[0.03] rounded-full blur-[100px] scale-150 transition-transform duration-1000`} />
                  
                  <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center transition-all duration-700">
                     <img 
                       src={s.icon} 
                       alt={s.title} 
                       className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-transform duration-700 pointer-events-none select-none group-hover:scale-[1.02]" 
                     />
                     
                     {/* Dynamic Step Marker - Integrated */}
                     <div 
                       className={`absolute -top-10 ${isEven ? '-left-10' : '-right-10'} w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl border border-white/50 backdrop-blur-xl transition-all duration-500`}
                       style={{ backgroundColor: "var(--color-teal)" }}
                     >
                       <span className="text-xs font-black tracking-widest text-white/50 mb-1 uppercase">Step</span>
                       <span className="text-4xl font-black text-white leading-none">0{s.num}</span>
                     </div>
                  </div>
                </div>

                {/* Narrative Text */}
                <div className="flex-1 text-center lg:text-left space-y-8 max-w-lg">
                  <div className="space-y-4">
                    {s.num === "1" ? (
                      <TypingText 
                        text={s.title} 
                        className="text-4xl lg:text-5xl font-black tracking-tighter leading-none min-h-[1.2em]" 
                      />
                    ) : (
                      <h3 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none" style={{ color: "var(--color-text-primary)" }}>
                        {s.title}
                      </h3>
                    )}
                    <div className="h-1.5 w-20 bg-[var(--color-teal)] rounded-full transition-all duration-500" />
                  </div>
                  <p className="text-lg lg:text-xl leading-relaxed text-[var(--color-text-secondary)] font-medium opacity-90">
                    {s.desc}
                  </p>

                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                     {["Secure", "Fast", "Free"].map(tag => (
                       <span key={tag} className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-100 text-[10px] font-black uppercase tracking-widest text-[var(--color-teal)]">
                         {tag}
                       </span>
                     ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── SECURITY SECTION ───── */}
      <section id="security" className="py-24 sm:py-40 lg:py-48 border-t border-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            
            {/* Security Narrative */}
            <div className="flex-1 space-y-12 animate-fadeIn order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-teal)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-teal)]">Bank-Grade Protection</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none" style={{ color: "var(--color-text-primary)" }}>
                  Your Data is <br />
                  <span className="text-[var(--color-teal)]">Fortress Protected.</span>
                </h2>
                <p className="text-lg lg:text-xl leading-relaxed text-[var(--color-text-secondary)] opacity-80 max-w-xl">
                  ExitDebt uses institutional encryption standards to ensure your financial integrity. We protect your dignity as fiercely as your data.
                </p>
              </div>

              {/* High-Impact Security Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-3 p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100/50 transition-all hover:shadow-xl hover:shadow-gray-200/20 group">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6 transition-transform">
                      <svg className="w-6 h-6" fill="var(--color-teal)" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.92v3.13a4 4 0 11-8 0V8.5a.5.5 0 011 0v.45a3 3 0 106 0V6.432L10 3.22 2.5 6.432v7.136c0 1.56 1.024 3.037 2.587 3.522L10 18.78l4.913-1.69c.991-.34 1.787-1.113 2.23-2.08a1 1 0 011.814.84a5.986 5.986 0 01-3.573 3.101L10 20.85l-5.384-1.854C2.616 18.358 1.5 16.51 1.5 14.5V6.5a1 1 0 01.666-.9z" clipRule="evenodd" />
                      </svg>
                   </div>
                   <h4 className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>AES-256 Bit</h4>
                   <p className="text-sm text-[var(--color-text-secondary)]">Advanced military-grade encryption standards for all sensitive information.</p>
                </div>

                <div className="space-y-3 p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100/50 transition-all hover:shadow-xl hover:shadow-gray-200/20 group">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6 transition-transform">
                      <svg className="w-6 h-6" fill="var(--color-teal)" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                   </div>
                   <h4 className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>SSL/TLS 1.3</h4>
                   <p className="text-sm text-[var(--color-text-secondary)]">Encrypted communication channels preventing any unauthorized interception.</p>
                </div>
              </div>
            </div>

            {/* Security Illustration Wrapper */}
            <div className="flex-1 relative w-full flex justify-center order-1 lg:order-2 group">
              {/* Organic Blob Background */}
              <div className="absolute -inset-20 bg-[var(--color-teal)] opacity-[0.03] rounded-full blur-[100px] scale-150 transition-transform duration-1000" />
              
              <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center transition-all duration-700">
                 <img 
                   src="/security.svg" 
                   alt="Bank-Grade Security" 
                   className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-transform duration-700 pointer-events-none select-none" 
                 />
                 {/* Decorative Floating Shield Marker */}
                 <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-xl border border-white/50 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <svg className="w-10 h-10 text-[var(--color-teal)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 1.944A11.947 11.947 0 012.383 4.41a.5.5 0 00-.198.544l1.307 5.455c.613 2.552 2.326 4.564 4.512 5.799l1.82 1.028a.5.5 0 00.47 0l1.82-1.028c2.186-1.235 3.899-3.247 4.512-5.799l1.307-5.455a.5.5 0 00-.198-.544A11.947 11.947 0 0110 1.944zM11 12a1 1 0 11-2 0 1 1 0 012 0zm-1-7a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PRICING SECTION ───── */}
      <section id="pricing" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="text-center mb-16 animate-fadeIn">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Choose Your Path to Freedom</h2>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">Flexible plans designed to support you at every stage of your debt recovery journey.</p>
        </div>

        <div className="flex justify-center mb-16">
          <PricingToggle isAnnual={isAnnual} onChange={setIsAnnual} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-16 items-stretch max-w-5xl mx-auto">
          <PricingCard
            tier="lite"
            isAnnual={isAnnual}
            onSubscribe={() => { window.location.href = "/get-started"; }}
          />
          <PricingCard
            tier="shield"
            isAnnual={isAnnual}
            onSubscribe={() => { window.location.href = "/get-started"; }}
            isRecommended
          />
          <PricingCard
            tier="shield_plus"
            isAnnual={isAnnual}
            onBookCall={() => { window.location.href = "/get-started"; }}
          />
        </div>
      </section>

      {/* ───── FAQ SECTION ───── */}
      <section id="faq" className="max-w-6xl mx-auto px-8 py-20 lg:py-28 border-t border-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Visuals & Headers */}
          <div className="flex flex-col text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-teal)" }}>Support</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>Frequently Asked Questions</h2>
            <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
              Everything you need to know about checking your debt health and how ExitDebt protects you.
            </p>
            
            <div className="relative w-full max-w-[400px] mx-auto lg:mx-0 aspect-square flex items-center justify-center animate-slideUp">
               <div className="absolute inset-0 bg-teal-500/5 rounded-full blur-[80px]" />
               <img 
                 src="/faq.svg" 
                 alt="FAQ Support" 
                 className="relative w-full h-full object-contain transition-transform duration-700 pointer-events-none select-none drop-shadow-xl" 
               />
            </div>
          </div>

          {/* Right Column: Accordion */ }
          <div className="flex flex-col">
            <FAQAccordion items={LANDING_FAQS} />
            
            <div className="text-center lg:text-left mt-12 p-8 rounded-2xl bg-teal-50 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold mb-1 text-gray-900">Still have questions?</h4>
                <p className="text-sm text-gray-600">Our team is here to help you navigate your financial journey.</p>
              </div>
              <Link href="/schedule" className="whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold text-white bg-[var(--color-teal)] hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                 Contact Support
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}
