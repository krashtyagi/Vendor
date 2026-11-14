"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { type UseFormReturn } from "react-hook-form";
import type { SignUpProps } from "@/schema/auth";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

type OTPFormProps = {
  onOTP: string;
  methods: UseFormReturn<SignUpProps>;
  setOnOTP: React.Dispatch<React.SetStateAction<string>>;
};

const OTP_LENGTH = 4;

export function OTPForm({ onOTP, methods, setOnOTP }: OTPFormProps) {
  const { setValue, watch } = methods;
  const emailValue = watch("email");

  useEffect(() => {
    setValue("otp", onOTP);
  }, [onOTP, setValue]);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200 text-white">
      {/* Title Block with Premium Styling */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-emerald-300 tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-white">
          Enter Verification Code
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-300/85 font-light leading-relaxed">
          We sent a {OTP_LENGTH}-digit code to{" "}
          <span className="font-semibold text-white font-mono">
            {emailValue || "your email"}
          </span>
          . Please enter it below to verify your partner account.
        </p>
      </div>

      <FieldGroup className="space-y-6">
        <Field>
          <FieldLabel htmlFor="otp" className="sr-only">
            Verification code
          </FieldLabel>

          <InputOTP
            id="otp"
            maxLength={OTP_LENGTH}
            value={onOTP}
            onChange={setOnOTP}
            className="justify-center"
            autoFocus
          >
            <InputOTPGroup className="gap-3 w-full justify-center">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="
                    h-14 w-12 sm:w-14
                    rounded-xl
                    border
                    border-zinc-800
                    bg-zinc-900/80
                    text-xl
                    font-bold
                    font-mono
                    text-white
                    focus-visible:border-[#0084ff]
                    focus-visible:ring-2
                    focus-visible:ring-[#0084ff]/20
                    transition-all
                  "
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <FieldDescription className="text-center text-xs text-zinc-400 font-light mt-4">
            Didn&apos;t receive the code? Check your spam folder or click Back to re-send.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
