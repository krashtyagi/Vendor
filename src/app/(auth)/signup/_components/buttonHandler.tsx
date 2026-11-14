"use client";

import { Button } from "@/components/ui/button";
import type { SignUpProps } from "@/schema/auth";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const ButtonHandler = ({
  currentStep,
  setCurrentStep,
  methods,
  loading,
  onGenerateOtp,
  veryOtp,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  onGenerateOtp: any;
  veryOtp: any;
}) => {
  const { formState, getFieldState, getValues } = methods;
  const { isDirty: isEmail } = getFieldState("email", formState);
  const { isDirty: isPassword } = getFieldState("password", formState);
  const { isDirty: isConfirmPassword } = getFieldState("confirmPassword", formState);

  switch (currentStep) {
    case 1:
      return (
        <Button
          disabled={loading}
          type="submit"
          className="w-full h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          {...(isEmail &&
            isPassword &&
            isConfirmPassword && {
              onClick: () => {
                onGenerateOtp(
                  getValues("email"),
                  getValues("password"),
                  getValues("role") || "vendor",
                  getValues("firstName"),
                  getValues("lastName"),
                  getValues("phoneNumber"),
                  setCurrentStep,
                );
              },
            })}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Sending Verification Code...</span>
            </>
          ) : (
            <>
              <span>Continue &amp; Get Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      );
  }

  return (
    <div className="flex gap-3 w-full justify-center">
      <Button
        type="button"
        variant="outline"
        className="w-1/3 h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-medium cursor-pointer"
        onClick={() => setCurrentStep(1)}
        disabled={loading}
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back
      </Button>
      <Button
        disabled={loading}
        type="submit"
        className="w-2/3 h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => {
          veryOtp(getValues("email"), getValues("otp"), setCurrentStep);
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>Verify Code &amp; Start Setup</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ButtonHandler;
