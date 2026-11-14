"use client";

import React from "react";
import { Check, Briefcase, Landmark, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

export interface StepItem {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const steps: StepItem[] = [
  {
    id: 1,
    title: "Business Profile",
    subtitle: "Identity & KYC",
    icon: Briefcase,
  },
  {
    id: 2,
    title: "Bank Account",
    subtitle: "Payouts & IFSC",
    icon: Landmark,
  },
  {
    id: 3,
    title: "Property Setup",
    subtitle: "Rooms & Photos",
    icon: Building2,
  },
];

interface AnimatedStepperProps {
  currentStep?: number;
  className?: string;
}

export default function AnimatedStepper({
  currentStep = 2,
  className,
}: AnimatedStepperProps) {
  const { currStep } = useAuthStore();

  // Mapping currentStep (which in database is 2 = Step 1, 3 = Step 2, 4 = Step 3)
  const activeStepId = currStep ?? currentStep;
  const localIndex = activeStepId >= 4 ? 2 : activeStepId === 3 ? 1 : 0;

  const progressPercent = Math.round(((localIndex + 1) / steps.length) * 100);
  const desktopProgressPercent = (localIndex / (steps.length - 1)) * 100;

  return (
    <div
      className={cn(
        "w-full select-none transition-all duration-300",
        className,
      )}
    >
      {/* 📱 MOBILE COMPACT VIEW (< 768px): Small UI progress bar only */}
      <div className="md:hidden flex flex-col gap-2 p-2.5 sm:p-3 rounded-xl bg-zinc-950/95 border border-white/10 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0084ff] text-white text-[10px] font-bold shrink-0 shadow-xs">
              {localIndex + 1}
            </span>
            <span className="font-semibold text-white truncate text-xs">
              {steps[localIndex]?.title}
            </span>
            <span className="text-[10px] text-zinc-400 font-light truncate hidden min-[380px]:inline">
              • {steps[localIndex]?.subtitle}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-zinc-400 font-mono">
              Step {localIndex + 1}/3
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded font-medium">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Small sleek progress line */}
        <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-[#0084ff] transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 💻 TABLET & DESKTOP EXPANDED VIEW (>= 768px) */}
      <div className="hidden md:block rounded-2xl p-5 backdrop-blur-2xl bg-zinc-950/90 border border-white/10 shadow-xl">
        {/* Stepper Header Pill */}
        {/* <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-200 text-xs font-medium shadow-xs">
            <span className="font-semibold text-white">
              Step {localIndex + 1} of 3:
            </span>
            <span className="text-zinc-300">{steps[localIndex]?.title}</span>
            <span className="text-[10px] text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full font-medium ml-1">
              {localIndex === 2 ? "Final Step" : "In Progress"}
            </span>
          </div>
        </div> */}

        {/* Progress Bar Container */}
        <div className="relative flex items-center justify-between max-w-2xl mx-auto px-6 sm:px-12">
          {/* Background Track Line */}
          <div className="absolute top-[20px] left-12 right-12 h-[3px] bg-zinc-800 -z-0 rounded-full overflow-hidden">
            {/* Animated Clean Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#0084ff] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(0,132,255,0.3)]"
              style={{ width: `${desktopProgressPercent}%` }}
            />
          </div>

          {steps.map((step, index) => {
            const isCompleted = index < localIndex;
            const isActive = index === localIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10"
              >
                {/* Circle Button */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 bg-zinc-950 shadow-sm",
                    isCompleted &&
                      "border-emerald-500 bg-emerald-600 text-white shadow-emerald-500/20 shadow-md",
                    isActive &&
                      "border-[#0084ff] ring-4 ring-[#0084ff]/20 text-[#0084ff] scale-105 shadow-md",
                    !isCompleted &&
                      !isActive &&
                      "border-zinc-800 text-zinc-500 bg-zinc-900/60",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5px] text-white animate-in zoom-in duration-300" />
                  ) : (
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-[#0084ff]" : "text-zinc-500",
                      )}
                    />
                  )}
                </div>

                {/* Labels below */}
                <div className="mt-2 text-center flex flex-col items-center max-w-[110px]">
                  <p
                    className={cn(
                      "font-medium text-[11px] tracking-tight leading-tight transition-colors",
                      isActive || isCompleted ? "text-white" : "text-zinc-500",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-light mt-0.5 line-clamp-1">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
