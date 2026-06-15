"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  ClipboardList,
  Settings2,
  Share2,
  Cookie,
  Clock,
  Lock,
  Fingerprint,
  Baby,
  Link2,
  RefreshCcw,
  Mail,
  Search,
  Printer,
  ChevronRight,
  Shield,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import LOGO from "@/components/logo/logo";
import { ModeToggle } from "@/components/ui/toggle-theme";
import { CompactFooter } from "@/components/footer/compactfooter";

const privacyData = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Info,
    content: "At Trivllo, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform.",
  },
  {
    id: "collection",
    title: "1. Information We Collect",
    icon: ClipboardList,
    subsections: [
      {
        title: "a. Information You Provide",
        points: [
          "Name, email address, phone number, and date of birth when you register or make a booking.",
          "Payment details (processed securely via third-party payment gateways).",
          "Travel preferences, special requests, and feedback you share with us.",
        ]
      },
      {
        title: "b. Information Collected Automatically",
        points: [
          "Device information (browser type, operating system, device ID).",
          "Usage data (pages visited, search queries, time spent on the platform).",
          "Location data (with your permission) to show relevant travel options near you.",
          "Cookies and similar tracking technologies.",
        ]
      },
      {
        title: "c. Information from Third Parties",
        points: [
          "If you sign in using Google, Facebook, or another third-party account, we may receive basic profile information from those platforms.",
        ]
      }
    ]
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    icon: Settings2,
    points: [
      "To process bookings and send confirmation, itinerary, and support communications.",
      "To personalize your experience and recommend relevant hotels, tours, and activities.",
      "To send promotional offers, travel deals, and newsletters (you may opt out at any time).",
      "To improve our platform, detect fraud, and ensure security.",
      "To comply with legal and regulatory obligations.",
    ]
  },
  {
    id: "sharing",
    title: "3. Sharing Your Information",
    icon: Share2,
    content: "Trivllo does not sell your personal data. We may share your information with:",
    points: [
      "Service Providers: Hotels, tour operators, and activity vendors to fulfill your bookings.",
      "Payment Partners: Secure payment processors for transaction handling.",
      "Technology Partners: Analytics and cloud service providers who assist in platform operations (bound by confidentiality agreements).",
      "Legal Authorities: When required by law or to protect the rights and safety of our users.",
    ]
  },
  {
    id: "cookies",
    title: "4. Cookies",
    icon: Cookie,
    content: "We use cookies to improve your browsing experience, remember your preferences, and analyze platform traffic. You can manage your cookie preferences through your browser settings. Disabling cookies may affect some features of the platform.",
  },
  {
    id: "retention",
    title: "5. Data Retention",
    icon: Clock,
    content: "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.",
  },
  {
    id: "security",
    title: "6. Data Security",
    icon: Lock,
    content: "We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal information. However, no system is completely secure, and we encourage users to keep their account credentials confidential.",
  },
  {
    id: "rights",
    title: "7. Your Rights",
    icon: Fingerprint,
    content: "As a user, you have the right to:",
    points: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate information.",
      "Request deletion of your data (subject to legal obligations).",
      "Opt out of marketing communications at any time.",
      "Withdraw consent for data processing where applicable.",
    ],
    contactInfo: "To exercise any of these rights, contact us at privacy@trivllo.com."
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    icon: Baby,
    content: "Trivllo does not knowingly collect personal information from individuals under the age of 18. If we become aware of such collection, the information will be promptly deleted.",
  },
  {
    id: "links",
    title: "9. Third-Party Links",
    icon: Link2,
    content: "Our platform may contain links to third-party websites. Trivllo is not responsible for the privacy practices of those sites and encourages users to review their policies independently.",
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    icon: RefreshCcw,
    content: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform.",
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: "For privacy-related queries or concerns:",
    details: {
      email: "privacy@trivllo.com",
      address: "Trivllo Technologies Pvt. Ltd., India",
    }
  }
];

export default function VendorPrivacyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("introduction");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of privacyData) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPrivacy = privacyData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.points &&
        item.points.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (item.subsections &&
        item.subsections.some(
          (sub) =>
            sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.points.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
        ))
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LOGO />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
              Vendor Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold hover:text-primary flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-muted/40 border-b py-16 px-6 sm:px-12 text-center">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
            <Shield className="w-3.5 h-3.5" />
            Privacy & Trust
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            At Trivllo, we protect your data. Learn how we handle your partner information securely.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
            <span>Last Updated: June 14, 2026</span>
            <span>•</span>
            <span>Trivllo Technologies Pvt. Ltd.</span>
          </div>

          {/* Search Controls */}
          <div className="max-w-md mx-auto relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search privacy details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-background border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Navigation (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-card border rounded-2xl p-4 shadow-sm space-y-1.5 max-h-[calc(100vh-140px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </span>
                <button
                  onClick={handlePrint}
                  title="Print Document"
                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              {privacyData.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="truncate">
                      {section.title.includes(". ") ? section.title.split(". ")[1] : section.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredPrivacy.length > 0 ? (
                filteredPrivacy.map((section, idx) => {
                  const Icon = section.icon;
                  return (
                    <motion.div
                      id={section.id}
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`group relative bg-card border rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 ${
                        activeSection === section.id
                          ? "ring-1 ring-primary/20 border-primary/40"
                          : ""
                      }`}
                    >
                      {/* Section Icon Anchor */}
                      <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-gradient-to-br from-primary to-indigo-600 dark:from-primary dark:to-indigo-800 text-white p-3 rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="pl-2 sm:pl-4 space-y-4">
                        <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-0">
                          {section.title}
                        </h2>

                        {section.content && (
                          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        )}

                        {/* Subsections details */}
                        {section.subsections && (
                          <div className="space-y-5 mt-3">
                            {section.subsections.map((sub, sIdx) => (
                              <div key={sIdx} className="space-y-1.5">
                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                  {sub.title}
                                </h3>
                                <ul className="space-y-2">
                                  {sub.points.map((point, pIdx) => (
                                    <li
                                      key={pIdx}
                                      className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground"
                                    >
                                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                                      <span className="leading-relaxed">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.points && (
                          <ul className="space-y-2.5 mt-3">
                            {section.points.map((point, pIdx) => (
                              <li
                                key={pIdx}
                                className="flex items-start gap-2.5 text-sm sm:text-base text-muted-foreground"
                              >
                                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.contactInfo && (
                          <p className="text-sm sm:text-base font-bold text-foreground mt-3">
                            {section.contactInfo}
                          </p>
                        )}

                        {section.details && (
                          <div className="mt-6 bg-muted/40 rounded-2xl p-4 sm:p-5 border grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Email Privacy Desk</p>
                                <a
                                  href={`mailto:${section.details.email}`}
                                  className="text-sm font-bold hover:underline"
                                >
                                  {section.details.email}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Shield className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Address</p>
                                <p className="text-sm font-bold text-foreground">
                                  {section.details.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border rounded-3xl p-12 text-center"
                >
                  <ClipboardList className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    We couldn&apos;t find any privacy policy terms matching &quot;{searchQuery}&quot;.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Print Help Option on Mobile */}
            <div className="flex sm:hidden justify-center pt-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-card border rounded-full text-xs font-bold text-muted-foreground shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                Print Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      <CompactFooter />
    </div>
  );
}
