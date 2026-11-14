"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface WatermelonAuthShellProps {
  children: React.ReactNode;
  categoryTag?: string;
  tagColor?: string;
  editorialSubtitle?: string;
  editorialTitle?: string;
  editorialDescription?: string;
  topElement?: React.ReactNode;
  rightContainerClassName?: string;
  isWide?: boolean; // When true, form side takes little more than half of screen (~58% - 60%)
}

export default function WatermelonAuthShell({
  children,
  categoryTag = "Partner Portal",
  tagColor = "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
  editorialSubtitle = "YOU CAN EASILY",
  editorialTitle = "Manage all your properties from a single command center",
  editorialDescription = "A high-performance hospitality suite engineered for luxury resorts, boutique stays, and premier hotel chains.",
  topElement,
  rightContainerClassName,
  isWide = false,
}: WatermelonAuthShellProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-x-clip text-neutral-100 antialiased selection:bg-[#0084ff] selection:text-white">
      {/* LEFT COLUMN: Watermelon Editorial Branding (Sticky on Desktop) */}
      <div
        className={cn(
          "hidden lg:flex flex-col justify-between p-8 xl:p-14 sticky top-0 h-screen select-none z-10 transition-all duration-300",
          isWide ? "lg:w-[42%] xl:w-[40%]" : "lg:w-1/2 xl:w-7/12",
        )}
      >
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl xl:text-4xl font-normal tracking-wide text-white drop-shadow-md">
              Trivllo
            </span>
            {/* <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md shadow-xs",
                tagColor,
              )}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{categoryTag}</span>
            </span> */}
          </div>

          <Link
            href="/login"
            className="text-xs font-normal text-white/70 hover:text-white transition-colors"
          >
            ← Back to Portal
          </Link>
        </div>

        {/* Center: Luminous Soft Cyan Aura Glow */}
        <div className="relative my-auto flex items-center justify-center pointer-events-none">
          <div className="w-72 xl:w-88 h-72 xl:h-88 rounded-full bg-gradient-to-tr from-cyan-400/20 via-sky-500/15 to-emerald-400/15 blur-3xl" />
        </div>

        {/* Bottom: Premium Editorial Typography */}
        <div className="space-y-4 max-w-lg z-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-400 font-mono drop-shadow-sm">
            {editorialSubtitle}
          </p>
          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-serif font-light text-white tracking-tight leading-[1.18] drop-shadow-md">
            {editorialTitle}
          </h1>
          <p className="text-xs xl:text-sm text-zinc-200/90 font-light leading-relaxed max-w-md tracking-wide">
            {editorialDescription}
          </p>

          <div className="pt-4 flex items-center gap-4 xl:gap-5 text-xs text-zinc-300 font-light border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant Guest Bookings</span>
            </div>
            <div>•</div>
            <div>Automated Bank Payouts</div>
            <div>•</div>
            <div>24/7 Support</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Glassy Form Container */}
      <div
        className={cn(
          "w-full min-h-screen flex flex-col items-center z-10 transition-all duration-300",
          isWide ? "lg:w-[58%] xl:w-[60%]" : "lg:w-1/2 xl:w-5/12",
          // Comfortable padding across all devices: compact on mobile, spacious on desktop
          "px-3 py-3 sm:px-6 sm:py-6 md:px-8 md:py-8 xl:px-12",
        )}
      >
        {/* Mobile top branding for small screens */}
        <div
          className={cn(
            "lg:hidden w-full flex items-center justify-between pb-2.5 pt-1 px-1",
            isWide ? "max-w-3xl xl:max-w-4xl" : "max-w-md",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-white">
              Trivllo
            </span>
            <span className="text-[10px] font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              Partner
            </span>
          </div>
          <Link
            href="/login"
            className="text-xs text-white/70 hover:text-white transition-colors"
          >
            Portal
          </Link>
        </div>

        {/* Sticky Top Progress Bar / Stepper: Stays fixed when scrolling down */}
        {topElement && (
          <div
            className={cn(
              "sticky top-0 z-[1050] w-full mb-3 sm:mb-5 pt-1.5 pb-2 sm:pt-2 sm:pb-3 backdrop-blur-xl bg-zinc-950/85 sm:bg-transparent -mt-1 sm:mt-0 transition-all",
              isWide ? "max-w-3xl xl:max-w-4xl" : "max-w-2xl",
            )}
          >
            {topElement}
          </div>
        )}

        {/* The Glassy Blurred Form Box */}
        <div
          className={cn(
            "w-full backdrop-blur-2xl bg-zinc-950/80 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.55)] rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 text-white transition-all duration-300",
            isWide ? "max-w-3xl xl:max-w-4xl" : "max-w-md",
            rightContainerClassName,
          )}
        >
          {children}
        </div>

        {/* Bottom copyright / security footer */}
        {/* <div className="mt-5 text-center text-[11px] sm:text-xs text-white/50 max-w-xs font-light">
          Protected by Trivllo 256-bit Bank Grade Security &amp; Encrypted Settlements.
        </div> */}
      </div>
    </div>
  );
}
