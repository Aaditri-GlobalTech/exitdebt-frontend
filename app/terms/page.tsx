import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | ExitDebt",
  description: "ExitDebt Terms & Conditions — the rules and guidelines for using our platform and services.",
  alternates: {
    canonical: "/terms",
  },
};

const LAST_UPDATED = "March 2026";
const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "eligibility", title: "1. Eligibility" },
  { id: "services", title: "2. Services" },
  { id: "obligations", title: "3. User Obligations" },
  { id: "comm", title: "4. Communications" },
  { id: "ip", title: "5. Intellectual Property" },
  { id: "warranties", title: "6. Disclaimer" },
  { id: "liability", title: "7. Liability" },
  { id: "indemnity", title: "8. Indemnity" },
  { id: "privacy", title: "9. Privacy" },
  { id: "mod", title: "10. Modifications" },
  { id: "term", title: "11. Termination" },
  { id: "law", title: "12. Governing Law" },
  { id: "sever", title: "13. Severability" },
  { id: "contact", title: "14. Contact Us" },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-teal)] selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Innovative Hero Section */}
        <section className="relative pt-24 pb-12 sm:pt-40 sm:pb-24 xl:pt-56 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-24">
              <div className="flex-1 max-w-4xl">
                <Link href="/" className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--color-teal)] uppercase tracking-widest mb-12 animate-fadeIn">
                   <span className="w-8 h-[2px] bg-[var(--color-teal)] group-hover:w-12 transition-all duration-300"></span>
                   Back to Home
                </Link>
                <h1 className="text-6xl sm:text-9xl xl:text-[10rem] font-black mb-12 tracking-tighter leading-[0.85] animate-slideUp">
                  Terms & <span className="text-[var(--color-teal)]">Rules.</span>
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest animate-slideUp stagger-1">
                  <span>Last Updated: {LAST_UPDATED}</span>
                  <span className="w-1.5 h-1.5 bg-[var(--color-teal)] rounded-full"></span>
                  <span>ExitDebt Platform</span>
                </div>
              </div>
              <div className="w-full lg:w-[24rem] animate-fadeIn transition-all hover:-translate-y-4 duration-1000 flex justify-center lg:justify-end relative">
                <img src="/terms.svg" alt="Terms" className="w-56 h-56 sm:w-72 sm:h-72 lg:w-full lg:max-h-[30rem] object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Floating Narrative Content Section */}
        <section className="py-24 sm:py-40 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              
              {/* Left Column: Sidebar / Sticky Index */}
              <div className="lg:col-span-4 relative border-r border-[var(--color-border)] pr-8 hidden lg:block">
                <div className="sticky top-32">
                  <div className="text-[var(--color-teal)] mb-12 flex gap-2">
                    <Circle className="fill-[var(--color-teal)] w-3 h-3" />
                  </div>
                  <nav className="space-y-4">
                    {SECTIONS.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className="group flex items-center gap-4 py-1 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-teal)] transition-all"
                      >
                        <span className="w-0 h-[2px] bg-[var(--color-teal)] group-hover:w-4 transition-all"></span>
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Right Column: Narrative Legal Text */}
              <div className="lg:col-span-8 space-y-32">
                
                <section id="intro" className="scroll-mt-32">
                  <p className="text-xl sm:text-2xl text-[var(--color-text-secondary)] leading-relaxed font-medium">
                    These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the website, applications, and related services provided by <strong className="text-[var(--color-text-primary)]">Aaditri GlobalTech Private Limited</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including the ExitDebt platform.
                  </p>
                  <p className="text-lg text-[var(--color-text-muted)] mt-8 leading-relaxed">
                    By accessing or using our Services, you agree to be bound by these Terms. If you do not agree, you must not access or use the Services.
                  </p>
                </section>

                <section id="eligibility" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    1. Eligibility
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    You must be at least 18 years of age and a resident of India to use our Services. By using the Services, you represent and warrant that you meet these requirements and that all information you provide is accurate, current, and complete.
                  </p>
                </section>

                <section id="services" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    2. Description
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We provide a technology platform related to financial wellness and debt management. The scope, features, pricing, and availability of our Services may change at any time without prior notice. Registration or expression of interest does not guarantee access to any particular service, feature, or benefit.
                  </p>
                </section>

                <section id="obligations" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    3. User <br /> Obligations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {[
                       { t: "Truthful Data", d: "Provide accurate and truthful information." },
                       { t: "Authorization", d: "Not submit information belonging to another person without their authorization." },
                       { t: "Security", d: "Not interfere with or disrupt the operation of the Services." },
                       { t: "Compliance", d: "Comply with all applicable laws and regulations." },
                     ].map((item, i) => (
                       <div key={i} className="p-8 border border-[var(--color-border)] rounded-3xl hover:border-[var(--color-teal)] transition-all group">
                          <h3 className="font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-teal)]">{item.t}</h3>
                          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{item.d}</p>
                       </div>
                     ))}
                  </div>
                </section>

                <section id="comm" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    4. Communications
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    By providing your contact information, you consent to receive communications from us through any medium, including but not limited to email, SMS, WhatsApp, telephone calls, push notifications, and in-app messages.
                  </p>
                  <p className="text-[var(--color-text-muted)] italic">
                    You may opt out of promotional communications at any time by using the unsubscribe mechanism provided in our communications or by contacting us directly.
                  </p>
                </section>

                <section id="ip" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    5. IP Rights
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    All content, features, functionality, trademarks, logos, design elements, and proprietary technology associated with the Services are owned by or licensed to the Company. You may not copy, modify, distribute, sell, or lease any part of our Services without our prior written consent.
                  </p>
                </section>

                <section id="warranties" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    6. Disclaimer
                  </h2>
                  <div className="p-12 border-2 border-teal-50 rounded-[3rem] bg-teal-50/10">
                    <p className="uppercase text-sm font-black text-[var(--color-text-primary)] leading-loose tracking-widest text-center">
                      The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We do not provide financial, legal, tax, or investment advice.
                    </p>
                  </div>
                </section>

                <section id="liability" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    7. Liability
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] uppercase font-bold leading-relaxed border-l-4 border-[var(--color-teal)] pl-8">
                    The Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Services.
                  </p>
                </section>

                <section id="indemnity" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    8. Indemnity
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, and expenses arising out of or related to your use of the Services, your violation of these Terms, or your violation of any rights of a third party.
                  </p>
                </section>

                <section id="privacy" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    9. Privacy
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    Your use of the Services is also governed by our <Link href="/privacy" className="underline font-medium transition-colors text-[var(--color-teal)]">Privacy Policy</Link>, which is incorporated into these Terms by reference.
                  </p>
                </section>

                <section id="mod" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    10. Modifications
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue the Services at any time. We may also update these Terms from time to time. The updated Terms will be effective upon posting on our website.
                  </p>
                </section>

                <section id="term" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    11. Termination
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We may terminate or suspend your access to the Services at our sole discretion, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
                  </p>
                </section>

                <section id="law" className="scroll-mt-32 space-y-12">
                  <div className="p-12 bg-teal-50/30 rounded-[3rem] border border-teal-100/50">
                    <h2 className="text-3xl font-black mb-8">12. Governing Law</h2>
                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6">
                      These Terms are governed by and construed in accordance with the laws of India.
                    </p>
                    <div className="flex items-center gap-4 text-[var(--color-teal)] font-black">
                       <ArrowRight size={20} />
                       <span>Exclusive Jurisdiction: Surat, Gujarat, India</span>
                    </div>
                  </div>
                </section>

                <section id="sever" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    13. Severability
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining provisions remain in full force and effect.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-32 pt-24">
                  <h2 className="text-4xl font-black mb-12">14. Contact Us</h2>
                  <div className="space-y-6 text-lg">
                    {[
                      { l: "Official Email", v: "admin@exitdebt.in" },
                      { l: "Grievance Officer", v: "Kumar R Anand" },
                      { l: "Grievance Email", v: "contact@exitdebt.in" },
                      { l: "Address", v: "Surat, Gujarat, India" }
                    ].map((row, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:justify-between border-b border-[var(--color-border)] pb-6">
                        <span className="font-bold text-[var(--color-text-muted)] uppercase tracking-widest text-sm">{row.l}</span>
                        <span className="font-black text-[var(--color-text-primary)]">{row.v}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-t border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)] italic">
              Your use of the Services signifies acceptance of these Terms and our <Link href="/privacy" className="text-[var(--color-teal)] font-bold hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
