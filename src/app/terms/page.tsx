"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Info,
  UserCheck,
  CreditCard,
  RotateCcw,
  FileText,
  Award,
  AlertTriangle,
  Scale,
  CalendarDays,
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

const termsData = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: CheckCircle2,
    content: "By accessing or using Trivllo's website, mobile application, or any services offered through our platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
  },
  {
    id: "about",
    title: "2. About Trivllo",
    icon: Info,
    content: "Trivllo is an online travel platform that enables users to discover, compare, and book hotels, tours, activities, and travel packages. We act as an intermediary between travelers and service providers (hotels, tour operators, activity vendors).",
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    icon: UserCheck,
    points: [
      "You must be at least 18 years of age to create an account and make bookings on Trivllo.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "Trivllo reserves the right to suspend or terminate accounts found to be in violation of these terms.",
    ],
  },
  {
    id: "bookings",
    title: "4. Bookings and Payments",
    icon: CreditCard,
    points: [
      "All bookings made through Trivllo are subject to availability and confirmation by the respective service provider.",
      "Prices displayed on the platform are inclusive of applicable taxes unless stated otherwise.",
      "Payments must be made in full at the time of booking unless a partial payment option is explicitly offered.",
      "Trivllo uses secure, third-party payment gateways. We do not store your card details on our servers.",
    ],
  },
  {
    id: "cancellations",
    title: "5. Cancellations and Refunds",
    icon: RotateCcw,
    points: [
      "Cancellation policies vary by service provider and are clearly displayed on each listing before booking.",
      "Refunds, where applicable, will be processed within 7–14 business days to the original payment method.",
      "Trivllo's platform fee (if any) may be non-refundable depending on the circumstances of cancellation.",
      "In case of cancellations due to natural disasters, government restrictions, or force majeure events, Trivllo will work with service providers to offer maximum relief to affected travelers.",
    ],
  },
  {
    id: "responsibilities",
    title: "6. User Responsibilities",
    icon: FileText,
    points: [
      "Users must ensure that all travelers listed in a booking meet the eligibility criteria set by the service provider.",
      "Users are responsible for carrying valid ID, travel documents, and any other requirements specified at booking.",
      "Trivllo is not liable for losses arising from inaccurate information provided by the user.",
    ],
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    icon: Award,
    content: "All content on the Trivllo platform — including logos, text, images, and software — is the property of Trivllo or its licensors and is protected under applicable intellectual property laws. Unauthorized reproduction or distribution is strictly prohibited.",
  },
  {
    id: "limitation-liability",
    title: "8. Limitation of Liability",
    icon: AlertTriangle,
    content: "Trivllo acts as a facilitator and is not directly responsible for the quality, safety, or delivery of services provided by third-party vendors. Our liability is limited to the amount paid for the specific booking in question.",
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    icon: Scale,
    content: "These Terms and Conditions are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts located in India.",
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    icon: CalendarDays,
    content: "Trivllo reserves the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms.",
  },
  {
    id: "contact",
    title: "11. Contact Us",
    icon: Mail,
    content: "For questions regarding these Terms and Conditions, please reach out to us at:",
    details: {
      email: "legal@trivllo.com",
      address: "Trivllo Technologies Pvt. Ltd., India",
    },
  },
];

export default function VendorTermsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("acceptance");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of termsData) {
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

  const filteredTerms = termsData.filter(
    (term) =>
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (term.content && term.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (term.points &&
        term.points.some((point) => point.toLowerCase().includes(searchQuery.toLowerCase())))
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
            Vendor Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            These terms regulate the partnership, roles, and guidelines for partners listing stays and tours on Trivllo.
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
              placeholder="Search partner terms..."
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

              {termsData.map((section) => {
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
                    <span className="truncate">{section.title.split(". ")[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((section, idx) => {
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

                        {section.details && (
                          <div className="mt-6 bg-muted/40 rounded-2xl p-4 sm:p-5 border grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Email Support</p>
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
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase">Registered Office</p>
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
                  <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-base font-bold">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                    We couldn&apos;t find any partner terms matching &quot;{searchQuery}&quot;.
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
                Print Agreement
              </button>
            </div>
          </div>
        </div>
      </div>

      <CompactFooter />
    </div>
  );
}
