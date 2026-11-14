"use client";

import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { MessageModal } from "@/app/(dashboard)/(categories)/rooms/_components/RoomsListing";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useState } from "react";
import { PageSkeleton } from "@/app/(dashboard)/(categories)/rooms/_components/details.skeleton";
import { useAuthContext } from "@/context/auth/AuthContextProvider";
import LOGO from "@/components/logo/logo";
import { OTPForm } from "./_components/otpForm";
import { useSignUp } from "./hooks/use-signup";
import React from "react";
import trivlloData from "@/../trivllo.json";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SignUpProps } from "@/schema/auth";
import ButtonHandler from "./_components/buttonHandler";
import { SignupSkeleton, OtpSkeleton } from "./_components/skeletons";
import WatermelonAuthShell from "@/components/auth/watermelon-auth-shell";
import {
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const { currentStep } = useAuthContext();

  return (
    <ErrorBoundary
      fallback={
        <MessageModal title="Error" description="Something went wrong" />
      }
    >
      <Suspense fallback={<PageSkeleton />}>
        <WatermelonAuthShell
          categoryTag="Partner Portal"
          editorialSubtitle="YOU CAN EASILY"
          editorialTitle="Get access your personal hub for clarity and hospitality growth"
          editorialDescription="Connect your properties to thousands of verified travelers, optimize inventory, and receive direct settlement payouts."
          rightContainerClassName="max-w-md"
        >
          <SignupForm />
        </WatermelonAuthShell>
      </Suspense>
    </ErrorBoundary>
  );
}

function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const { currentStep, setCurrentStep } = useAuthContext();
  const { loading, methods, onHandleSubmit, onGenerateOtp, veryOtp } =
    useSignUp();

  if (loading) {
    if (currentStep === 2) {
      return <OtpSkeleton />;
    }
    return <SignupSkeleton />;
  }

  return (
    <div className={cn("w-full space-y-6", className)} {...props}>
      <Form {...methods}>
        <form onSubmit={onHandleSubmit} className="space-y-6">
          <SignupOtp currentStep={currentStep} methods={methods} />
          <div>
            <ButtonHandler
              currentStep={currentStep}
              methods={methods}
              setCurrentStep={setCurrentStep}
              loading={loading}
              onGenerateOtp={onGenerateOtp}
              veryOtp={veryOtp}
            />
          </div>
        </form>
      </Form>

      <div className="text-center text-[11px] text-zinc-400 font-light px-2 leading-relaxed">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline text-white hover:text-[#0084ff] transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline text-white hover:text-[#0084ff] transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

const SignupOtp = ({
  currentStep,
  methods,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
}) => {
  const [onOTP, setOnOTP] = React.useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const {
    register,
    formState: { errors },
  } = methods;

  if (currentStep === 2) {
    return <OTPForm methods={methods} onOTP={onOTP} setOnOTP={setOnOTP} />;
  }

  const inputClasses =
    "w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-5 py-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:outline-none focus:ring-2 focus:ring-[#0084ff]/20 transition-all";

  return (
    <FieldGroup className="space-y-5 ">
      {/* Title Block with Premium Styling */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-white">
          Get Started Now
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-300/85 font-light leading-relaxed tracking-wide">
          Create your vendor partner account to manage listings and earn
          payouts.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={cn(
                inputClasses,
                errors.email && "border-rose-500 focus:ring-rose-500/20",
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 pl-3">{errors.email.message}</p>
          )}
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="firstName"
                placeholder="Rahul"
                {...register("firstName")}
                className={cn(
                  inputClasses,
                  "pl-11 pr-4",
                  errors.firstName && "border-rose-500 focus:ring-rose-500/20",
                )}
              />
            </div>
            {errors.firstName && (
              <p className="text-xs text-rose-400 pl-2">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="lastName"
                placeholder="Sharma"
                {...register("lastName")}
                className={cn(
                  inputClasses,
                  "pl-11 pr-4",
                  errors.lastName && "border-rose-500 focus:ring-rose-500/20",
                )}
              />
            </div>
            {errors.lastName && (
              <p className="text-xs text-rose-400 pl-2">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phoneNumber"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Phone number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              {...register("phoneNumber")}
              className={cn(
                inputClasses,
                errors.phoneNumber && "border-rose-500 focus:ring-rose-500/20",
              )}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-xs text-rose-400 pl-3">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("password")}
              className={cn(
                inputClasses,
                "pr-11",
                errors.password && "border-rose-500 focus:ring-rose-500/20",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 pl-3">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("confirmPassword")}
              className={cn(
                inputClasses,
                "pr-11",
                errors.confirmPassword &&
                  "border-rose-500 focus:ring-rose-500/20",
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 pl-3">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 rounded-md border-white/20 bg-white/5 text-[#0084ff] focus:ring-[#0084ff]/20 accent-[#0084ff]"
          />
          <label
            htmlFor="terms-checkbox"
            className="text-xs text-zinc-300 font-light cursor-pointer select-none"
          >
            I agree to the{" "}
            <a href="#" className="underline text-white hover:text-[#0084ff]">
              terms &amp; policy
            </a>
          </label>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-zinc-400 font-light">
          Already have a vendor account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#0084ff] hover:text-sky-300 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </FieldGroup>
  );
};
