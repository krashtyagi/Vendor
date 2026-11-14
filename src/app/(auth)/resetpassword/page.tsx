"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useResetPassword } from "@/hooks/auth/forgotPassword";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { MessageModal } from "@/app/(dashboard)/(categories)/rooms/_components/RoomsListing";
import { PageSkeleton } from "@/app/(dashboard)/(categories)/rooms/_components/details.skeleton";
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import WatermelonAuthShell from "@/components/auth/watermelon-auth-shell";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
      <Suspense fallback={<PageSkeleton />}>
        <WatermelonAuthShell
          categoryTag="Account Recovery"
          editorialSubtitle="ACCOUNT SECURITY"
          editorialTitle="Recover access to your vendor command center"
          editorialDescription="Reset your credentials with secure verification codes sent directly to your registered business email."
          rightContainerClassName="max-w-md"
        >
          <ResetPasswordForm />
        </WatermelonAuthShell>
      </Suspense>
    </ErrorBoundary>
  );
}

function ResetPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const { methods, loading, onGenerateOtp, onVerify, onHandleSubmit } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = methods.watch("email");
  const otp = methods.watch("otp");

  const handleSendOtp = async () => {
    if (!email) {
      methods.setError("email", { type: "manual", message: "Email is required" });
      return;
    }
    await onGenerateOtp(email, setStep);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      methods.setError("otp", { type: "manual", message: "OTP must be 4 digits" });
      return;
    }
    await onVerify(email, otp, setStep);
  };

  const inputClasses =
    "w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-5 py-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:outline-none focus:ring-2 focus:ring-[#0084ff]/20 transition-all disabled:opacity-50";

  return (
    <div className={cn("w-full space-y-6", className)} {...props}>
      <Form {...methods}>
        <form onSubmit={onHandleSubmit} className="space-y-6">
          <FieldGroup className="space-y-5">
            {/* Title Block with Premium Styling */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-emerald-300 tracking-wide mb-3">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Password Recovery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-white">
                Reset Password
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-300/85 font-light leading-relaxed tracking-wide">
                {step === 1 && "Enter your registered email address to receive a verification code."}
                {step === 2 && "Enter the 4-digit verification code sent to your email."}
                {step === 3 && "Create a new strong password for your vendor account."}
              </p>
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-xs font-medium text-zinc-300 tracking-wide">
                  Email Address
                </label>
                <FormField
                  control={methods.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            id="reset-email"
                            type="email"
                            placeholder="Enter your registered email"
                            disabled={loading}
                            {...field}
                            className={inputClasses}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400 pl-3 pt-1" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="flex flex-col items-center gap-4 py-2">
                <FormField
                  control={methods.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="space-y-2 text-center">
                      <FormControl>
                        <InputOTP
                          maxLength={4}
                          value={field.value}
                          onChange={field.onChange}
                          className="justify-center"
                        >
                          <InputOTPGroup className="gap-3">
                            {[0, 1, 2, 3].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className="h-14 w-12 sm:w-14 rounded-xl border border-zinc-800 bg-zinc-900/80 text-xl font-bold font-mono text-white focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/20 transition-all"
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage className="text-xs text-rose-400 pt-1" />
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-xs text-[#0084ff] hover:text-sky-300 hover:underline font-medium"
                >
                  Resend code
                </button>
              </div>
            )}

            {/* Step 3: New Passwords */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="new-password" className="text-xs font-medium text-zinc-300 tracking-wide">
                    New Password
                  </label>
                  <FormField
                    control={methods.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                              id="new-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              disabled={loading}
                              {...field}
                              className={cn(inputClasses, "pr-11")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-rose-400 pl-3 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="confirm-password" className="text-xs font-medium text-zinc-300 tracking-wide">
                    Confirm New Password
                  </label>
                  <FormField
                    control={methods.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              disabled={loading}
                              {...field}
                              className={cn(inputClasses, "pr-11")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-rose-400 pl-3 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Clean Solid Blue Submit Buttons (No colorful rainbow gradient) */}
            <div className="pt-2">
              {step === 1 && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}

              {step === 2 && (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-1/3 h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-2/3 h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {step === 3 && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Set New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </FieldGroup>
        </form>
      </Form>

      {/* Return to Sign in */}
      <div className="text-center pt-2 border-t border-white/10">
        <Link
          href="/login"
          className="text-xs font-medium text-[#0084ff] hover:text-sky-300 hover:underline"
        >
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}
