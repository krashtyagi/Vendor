"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  MessageSquare,
  Building,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import LOGO from "@/components/logo/logo";
import { ModeToggle } from "@/components/ui/toggle-theme";
import { CompactFooter } from "@/components/footer/compactfooter";

export default function VendorContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "general", message: "" });
    }, 1500);
  };

  const departments = [
    {
      title: "Partner Support Desk",
      description: "Get assistance with your listing, payments, or dashboard.",
      email: "partners@trivllo.com",
      icon: MessageSquare,
    },
    {
      title: "General Relations",
      description: "Any corporate or non-support partner enquiries.",
      email: "hello@trivllo.com",
      icon: HelpCircle,
    },
    {
      title: "Legal & Compliance",
      description: "Vendor terms, privacy, and verification questions.",
      email: "legal@trivllo.com",
      icon: Building,
    },
  ];

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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/20">
            <Mail className="w-3.5 h-3.5" />
            Vendor Relations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact Partner Support
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Need help with your property or travel experiences? Get in touch with our partner success team.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Side */}
          <div className="space-y-6 lg:col-span-1">
            <h2 className="text-xl font-bold tracking-tight">Contact Channels</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have active issues regarding payouts or property listing verification, please use the partner support email for faster dispatch.
            </p>

            <div className="space-y-4 pt-2">
              {departments.map((dept, idx) => {
                const Icon = dept.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card border rounded-2xl p-5 space-y-2 hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3 text-primary">
                      <Icon className="w-5 h-5 shrink-0" />
                      <h3 className="font-bold text-sm">{dept.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{dept.description}</p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-xs font-semibold text-primary hover:underline block pt-1"
                    >
                      {dept.email}
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted/40 border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wider">Registered Office</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                Trivllo Technologies Pvt. Ltd., India
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold">Write to Partner Success</h2>
                <p className="text-xs text-muted-foreground mt-1">Please include your registered business name or partner ID for quicker assistance.</p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 rounded-2xl p-6 text-center space-y-3"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-300">Message Dispatched</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-450 max-w-sm mx-auto">
                    We have received your query. A partner support representative will email you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold transition-colors"
                  >
                    Send another query
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-[10px] font-bold uppercase text-muted-foreground">Business / Partner Name</label>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder="e.g. Grand Palace Hotel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-[10px] font-bold uppercase text-muted-foreground">Registered Email</label>
                      <input
                        type="email"
                        id="email"
                        required
                        placeholder="e.g. partner@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-[10px] font-bold uppercase text-muted-foreground">Inquiry Category</label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    >
                      <option value="general">General Help / Onboarding</option>
                      <option value="billing">Payouts & Commission Invoice</option>
                      <option value="listing">Listing Modification / Review</option>
                      <option value="legal">Terms or Compliance Queries</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-[10px] font-bold uppercase text-muted-foreground">Details</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Please describe your support request in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Request
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompactFooter />
    </div>
  );
}
