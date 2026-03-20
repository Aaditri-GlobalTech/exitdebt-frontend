import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, Dot, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | ExitDebt",
  description: "ExitDebt Privacy Policy — how Aaditri GlobalTech Private Limited collects, uses, stores, and shares your personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

const LAST_UPDATED = "March 2026";

const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "collection", title: "1. Information We Collect" },
  { id: "usage", title: "2. How We Use Data" },
  { id: "sharing", title: "3. Sharing Data" },
  { id: "cookies", title: "4. Cookies" },
  { id: "retention", title: "5. Data Retention" },
  { id: "security", title: "6. Data Security" },
  { id: "rights", title: "7. Your Rights" },
  { id: "children", title: "8. Children" },
  { id: "links", title: "9. Third-Party Links" },
  { id: "changes", title: "10. Changes" },
  { id: "contact", title: "11. Contact Us" },
];

export default function PrivacyPolicyPage() {
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
                  Privacy <span className="text-[var(--color-teal)]">Policy.</span>
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest animate-slideUp stagger-1">
                  <span>Last Updated: {LAST_UPDATED}</span>
                  <span className="w-1.5 h-1.5 bg-[var(--color-teal)] rounded-full"></span>
                  <span>Aaditri GlobalTech</span>
                </div>
              </div>
              <div className="w-full lg:w-[24rem] animate-fadeIn transition-all hover:-translate-y-4 duration-1000 flex justify-center lg:justify-end relative">
                <img src="/privacy.svg" alt="Privacy" className="w-56 h-56 sm:w-72 sm:h-72 lg:w-full lg:max-h-[30rem] object-contain drop-shadow-2xl" />
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
                
                <section id="intro" className="scroll-mt-32 group">
                  <p className="text-xl sm:text-2xl text-[var(--color-text-secondary)] leading-relaxed font-medium">
                    This Privacy Policy describes how <strong className="text-[var(--color-text-primary)]">Aaditri GlobalTech Private Limited</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, stores, and shares information in connection with your use of our website, applications, and related services (collectively, the &quot;Services&quot;), including the ExitDebt platform.
                  </p>
                  <p className="text-lg text-[var(--color-text-muted)] mt-8 leading-relaxed">
                    By accessing or using our Services, you agree to the collection and use of information in accordance with this Policy. If you do not agree, please do not use our Services.
                  </p>
                </section>

                <section id="collection" className="scroll-mt-32 space-y-12">
                  <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    1. Information <br /> We Collect
                  </h2>
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-[var(--color-teal)] uppercase tracking-widest">1.1 Provided by You</h3>
                      <p className="text-[var(--color-text-secondary)]">We collect information that you voluntarily provide when you interact with our Services, including but not limited to:</p>
                      <ul className="space-y-4 text-[var(--color-text-secondary)] font-medium">
                        {["Name", "Email Address", "Phone Number", "Any other information you choose to provide"].map(item => (
                          <li key={item} className="flex gap-4 items-center">
                            <span className="w-2 h-2 rounded-full bg-teal-100 border border-[var(--color-teal)]"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-8 bg-teal-50/30 rounded-3xl border border-teal-100/50">
                       <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">1.2 Automated Collection</h3>
                       <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                         When you access our Services, we may automatically collect certain information, including:
                       </p>
                       <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--color-text-secondary)]">
                         {["IP address", "Browser type and version", "Operating system", "Device identifiers", "Pages visited and time spent", "Referring URLs", "Cookies and similar technologies"].map(item => (
                           <li key={item} className="flex items-center gap-2">
                             <span className="w-1 h-1 bg-[var(--color-teal)] rounded-full"></span>
                             {item}
                           </li>
                         ))}
                       </ul>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-[var(--color-teal)] uppercase tracking-widest">1.3 Third Parties</h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        We may receive information about you from third-party sources, including credit information companies, financial data providers, analytics providers, advertising networks, identity verification services, and publicly available sources, and combine it with information we collect from you.
                      </p>
                    </div>
                  </div>
                </section>

                <section id="usage" className="scroll-mt-32 space-y-12">
                  <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    2. How We Use Data
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    {[
                      "To provide, maintain, and improve our Services",
                      "To communicate with you, including updates and marketing",
                      "To personalize your experience",
                      "To process transactions and manage your relationship",
                      "To conduct research, analytics, and product development",
                      "To enforce our terms, policies, and legal rights",
                      "To comply with applicable laws and legal processes",
                      "To detect, prevent, and address fraud and security issues",
                      "For any other purpose with your consent"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-8 p-6 border border-[var(--color-border)] rounded-2xl hover:border-[var(--color-teal)] transition-all">
                        <span className="text-4xl font-black text-teal-50">{i + 1}</span>
                        <span className="text-lg font-bold text-[var(--color-text-secondary)]">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="sharing" className="scroll-mt-32 space-y-12">
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">3. Sharing</h2>
                    <div className="flex-grow h-0.5 bg-[var(--color-teal)] opacity-10"></div>
                  </div>
                  <div className="space-y-16">
                    {[
                      { 
                        l: "Service Providers", 
                        d: "With third-party vendors, consultants, and service providers who perform services on our behalf (hosting, analytics, email, etc.)."
                      },
                      { 
                        l: "Business Partners", 
                        d: "With our business partners, affiliates, and collaborators in connection with providing and improving our Services."
                      },
                      { 
                        l: "Legal Requirements", 
                        d: "When required by law, regulation, or legal process, or to protect our rights, property, or safety."
                      },
                      { 
                        l: "Business Transfers", 
                        d: "In connection with any merger, acquisition, sale of assets, or bankruptcy, as a business asset."
                      },
                      { 
                        l: "With Your Consent", 
                        d: "When you have given us explicit or implied consent to share your information."
                      }
                    ].map((item, i) => (
                      <div key={i} className="relative pl-12">
                        <div className="absolute left-0 top-0 text-[var(--color-teal)]">
                          <Circle size={24} className="fill-teal-50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.l}</h3>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="cookies" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    4. Cookies
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We use cookies and similar technologies to collect usage information, remember your preferences, and improve our Services. You can manage cookie preferences through your browser settings. Disabling cookies may affect the functionality of our Services.
                  </p>
                </section>

                <section id="retention" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    5. Data Retention
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We retain your information for as long as necessary to fulfill the purposes described in this Policy, or as required by law. When your information is no longer needed, we will delete or anonymize it in accordance with our internal data retention policies.
                  </p>
                </section>

                <section id="security" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    6. Data Security
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We implement reasonable administrative, technical, and physical safeguards to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section id="rights" className="scroll-mt-32 space-y-12">
                  <div className="p-12 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 opacity-5 transition-transform duration-700">
                      <Dot size={400} />
                    </div>
                    <h2 className="text-3xl font-black mb-8 relative z-10">7. Your Rights</h2>
                    <p className="text-[var(--color-text-secondary)] mb-12 relative z-10 leading-relaxed">
                      Subject to applicable law, including the <strong>Digital Personal Data Protection Act, 2023</strong>, you may have the following rights regarding your personal data:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 relative z-10">
                       {[
                         { t: "Access", d: "Request access to the personal data we hold about you." },
                         { t: "Correction", d: "Request correction of inaccurate or incomplete data." },
                         { t: "Erasure", d: "Request deletion of your personal data, subject to legal obligations." },
                         { t: "Withdraw Consent", d: "Withdraw consent where processing is based on consent." },
                         { t: "Grievance Redressal", d: "Lodge a complaint with us or the appropriate authority." },
                         { t: "Nominate", d: "Nominate a representative to exercise your rights on your behalf." }
                       ].map(right => (
                         <div key={right.t} className="space-y-2">
                            <div className="flex gap-4 items-center font-bold text-[var(--color-teal)] mb-2">
                                <ArrowRight size={16} />
                                {right.t}
                            </div>
                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed pl-8">{right.d}</p>
                         </div>
                       ))}
                    </div>
                    <p className="mt-12 text-sm text-[var(--color-text-muted)] relative z-10 italic">
                      To exercise any of these rights, contact us at the details provided in Section 11.
                    </p>
                  </div>
                </section>

                <section id="children" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    8. Children
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal data from minors. If we become aware that we have collected information from a minor, we will take steps to delete it.
                  </p>
                </section>

                <section id="links" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    9. Third-Party Links
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    Our Services may contain links to third-party websites or services. We are not responsible for the privacy practices or content of such third parties. We encourage you to read the privacy policies of any third-party services you visit.
                  </p>
                </section>

                <section id="changes" className="scroll-mt-32 space-y-12">
                   <h2 className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                    10. Changes
                  </h2>
                  <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated Policy on our website with a revised &quot;Last Updated&quot; date. Your continued use of the Services after any changes constitutes your acceptance of the updated Policy.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-32 pt-24">
                  <h2 className="text-4xl font-black mb-12">11. Contact Us</h2>
                  <p className="text-lg text-[var(--color-text-secondary)] mb-12">
                    If you have questions or concerns about this Policy, or wish to exercise your rights, please contact us:
                  </p>
                  <div className="space-y-6 text-lg">
                    {[
                      { l: "Email", v: "admin@exitdebt.in" },
                      { l: "Grievance Officer", v: "Kumar R Anand" },
                      { l: "Grievance Email", v: "contact@exitdebt.in" },
                      { l: "Response Time", v: "Within 30 days" },
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

      </main>

      <Footer />
    </div>
  );
}
