"use client";

import { UseFormReturn } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SignUpProps } from "@/schema/auth";
import ImageField from "./image-input";
import { Landmark, User, CreditCard, MapPin, ShieldCheck } from "lucide-react";

export const Step_2 = ({
  methods,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = methods;

  const inputClasses =
    "h-10 sm:h-11 bg-white/5 border-white/15 text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:ring-2 focus:ring-[#0084ff]/20 rounded-xl text-xs transition-all";

  return (
    <FieldGroup className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 text-white">
      {/* Mobile-Responsive Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
            <Landmark className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-serif font-normal text-white truncate">
              Step 2: Settlement Bank Account &amp; Payouts
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-300 font-light truncate sm:whitespace-normal">
              Bank details for receiving guest booking payouts and financial settlements.
            </p>
          </div>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/25 shrink-0">
          Payout Account
        </span>
      </div>

      {/* Section 1: Account Holder & Bank Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Field>
          <div className="flex items-center gap-2 mb-1.5">
            <User className="w-4 h-4 text-emerald-400" />
            <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
              Account Holder Name
            </FieldLabel>
          </div>
          <Input
            id="accountHolderName"
            placeholder="Name as per Bank Passbook"
            {...register("accountHolderName")}
            className={cn(
              inputClasses,
              errors.accountHolderName && "border-rose-500 focus:ring-rose-500/20"
            )}
          />
          {errors.accountHolderName && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.accountHolderName.message}
            </p>
          )}
        </Field>

        <Field>
          <div className="flex items-center gap-2 mb-1.5">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
              Bank Name
            </FieldLabel>
          </div>
          <Input
            id="bankName"
            placeholder="e.g. HDFC Bank / State Bank of India"
            {...register("bankName")}
            className={cn(
              inputClasses,
              errors.bankName && "border-rose-500 focus:ring-rose-500/20"
            )}
          />
          {errors.bankName && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.bankName.message}
            </p>
          )}
        </Field>
      </div>

      {/* Section 2: Numbers & Routing Box */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
                Account Number
              </FieldLabel>
            </div>
            <Input
              id="accountNumber"
              type="password"
              placeholder="0000 0000 0000"
              {...register("accountNumber")}
              className={cn(
                inputClasses,
                "font-mono tracking-widest",
                errors.accountNumber && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
            {errors.accountNumber && (
              <p className="text-xs font-medium text-rose-400 mt-1.5">
                {errors.accountNumber.message}
              </p>
            )}
          </Field>

          <Field>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                IFSC
              </span>
              <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
                IFSC Code
              </FieldLabel>
            </div>
            <Input
              id="ifscCode"
              placeholder="HDFC0001234"
              {...register("ifscCode")}
              className={cn(
                inputClasses,
                "uppercase font-mono",
                errors.ifscCode && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
            {errors.ifscCode && (
              <p className="text-xs font-medium text-rose-400 mt-1.5">
                {errors.ifscCode.message}
              </p>
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
                Branch Location
              </FieldLabel>
            </div>
            <Input
              id="branchName"
              placeholder="e.g. Fort, Mumbai"
              {...register("branchName")}
              className={inputClasses}
            />
          </Field>

          <Field>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                UPI
              </span>
              <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
                UPI ID (Optional)
              </FieldLabel>
            </div>
            <Input
              id="upiId"
              placeholder="business@okaxis"
              {...register("upiId")}
              className={inputClasses}
            />
          </Field>
        </div>
      </div>

      {/* Section 3: Bank Proof Upload */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bank Verification Document</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 font-light">
            Upload a clear photo of your cancelled cheque or bank passbook front page.
          </p>
        </div>

        <div className="w-full sm:max-w-md p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
          <ImageField
            label="Cancelled Cheque / Passbook Copy"
            docName="bankProof"
            onUploadSuccess={(data) => {
              setValue(
                "bankProof",
                {
                  url: data.url,
                  public_id: data.public_id,
                  resource_type: data.resource_type,
                },
                { shouldValidate: true }
              );
            }}
            onRemove={() => {
              setValue(
                "bankProof",
                {
                  url: "",
                  public_id: "",
                  resource_type: "image",
                },
                { shouldValidate: true }
              );
            }}
          />
        </div>
      </div>
    </FieldGroup>
  );
};
