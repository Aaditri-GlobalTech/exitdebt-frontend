import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Circle, Dot } from "lucide-react";

export const metadata = {
  title: "About ExitDebt | India's Smartest Debt Management Platform",
  description: "ExitDebt is India's structured debt management platform helping individuals resolve credit card debt, EMIs, and personal loans legally and effectively.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About ExitDebt",
    description: "ExitDebt is India's structured debt management platform helping individuals resolve credit card debt, EMIs, and personal loans.",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-teal)] selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Innovative Hero Section */}
        <section className="relative pt-24 pb-12 sm:pt-40 sm:pb-24 xl:pt-56 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-30"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-24">
              <div className="flex-1 max-w-4xl">
                <Link href="/" className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-teal)] uppercase tracking-widest mb-12 animate-fadeIn">
                   <span className="w-8 h-[2px] bg-[var(--color-teal)] group-hover:w-12 transition-all duration-300"></span>
                   Back to Home
                </Link>
                <h1 className="text-6xl sm:text-9xl xl:text-[10rem] font-black mb-12 tracking-tighter leading-[0.85] animate-slideUp">
                  The <span className="text-[var(--color-teal)]">Future</span> <br />
                  of Debt.
                </h1>
                <p className="text-2xl sm:text-3xl text-[var(--color-text-primary)] leading-tight max-w-xl font-medium animate-slideUp stagger-1">
                  India&apos;s smartest platform to understand, restructure, and exit debt.
                </p>
              </div>
              <div className="w-full lg:w-[28rem] animate-fadeIn transition-all hover:-translate-y-4 duration-1000 flex justify-center lg:justify-end relative">
                <img src="/aboutus.svg" alt="Innovation" className="w-64 h-64 sm:w-80 sm:h-80 lg:w-full lg:max-h-[35rem] object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Floating Narrative Section */}
        <section className="py-24 sm:py-40 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Column: Stylized Header */}
              <div className="lg:col-span-5 relative">
                <div className="sticky top-32">
                  <div className="text-[var(--color-teal)] mb-8 flex gap-2">
                    <Circle className="fill-[var(--color-teal)] w-3 h-3" />
                    <Circle className="w-3 h-3" />
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black mb-12 text-[var(--color-text-primary)] leading-[1.1] tracking-tight">
                    Structured <br /> 
                    Repayment, <br />
                    Real Freedom.
                  </h2>
                  <div className="text-sm font-bold text-teal-400/30 uppercase tracking-[0.5em] select-none pointer-events-none">
                    Aaditri GlobalTech
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Text Blocks */}
              <div className="lg:col-span-7 space-y-24 sm:space-y-40">
                <div className="group animate-slideUp stagger-1 p-8 sm:p-12 border-l-2 border-transparent hover:border-[var(--color-teal)] transition-all">
                  <p className="text-xl sm:text-2xl text-[var(--color-text-secondary)] leading-relaxed font-medium">
                    <strong className="text-[var(--color-text-primary)]">ExitDebt</strong> is India&apos;s structured debt management platform that helps individuals resolve credit card debt,
                    personal loan obligations, and EMI burdens through personalised financial planning and debt restructuring.
                  </p>
                </div>

                <div className="animate-slideUp stagger-2 p-8 sm:p-12 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] relative overflow-hidden group transition-transform">
                  <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-500">
                    <Dot size={300} strokeWidth={4} />
                  </div>
                  <p className="text-xl sm:text-2xl text-[var(--color-text-primary)] leading-relaxed italic relative z-10">
                    &quot;If you are overwhelmed by multiple loan repayments or rising interest costs, ExitDebt analyses your
                    complete debt profile, builds a legally compliant restructuring strategy, and guides you step-by-step
                    until you are financially free.&quot;
                  </p>
                </div>

                <div className="animate-slideUp stagger-3 p-8 sm:p-12">
                  <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed space-y-8">
                    <span>
                      We provide the tools and professional support needed to navigate financial stress legally, 
                      protect credit scores, and regain financial freedom. 
                    </span>
                    <br /><br />
                    <span className="inline-block py-2 px-6 bg-[var(--color-teal)] text-white rounded-full font-bold text-sm tracking-widest uppercase">
                      The Commitment
                    </span>
                    <br /><br />
                    <span>
                      ExitDebt is operated by <strong>Aaditri GlobalTech Private Limited</strong> and is specifically designed for 
                      Indian borrowers seeking a structured, compliant path to becoming debt-free.
                    </span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
