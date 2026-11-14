"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serviceTypeEnumProps, SignUpProps } from "@/schema/auth";
import ImageField from "./image-input";
import {
  MapPin,
  Loader2,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

export const Step_1 = ({
  methods,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const cityVal = data.city || data.locality || "";
          const stateVal = data.principalSubdivision || "";
          const countryVal = data.countryName || "India";
          const fullAddress = [cityVal, stateVal, countryVal]
            .filter(Boolean)
            .join(", ");

          if (cityVal) setValue("city", cityVal, { shouldValidate: true });
          if (stateVal) setValue("state", stateVal, { shouldValidate: true });
          if (countryVal)
            setValue("country", countryVal, { shouldValidate: true });
          if (fullAddress)
            setValue("businessAddress", fullAddress, { shouldValidate: true });

          toast.success("Business location auto-filled!");
        } catch (error) {
          toast.error("Failed to fetch address from coordinates.");
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Location access denied.");
      },
      { enableHighAccuracy: true }
    );
  };

  const inputClasses =
    "h-10 sm:h-11 bg-white/5 border-white/15 text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:ring-2 focus:ring-[#0084ff]/20 rounded-xl text-xs transition-all";

  return (
    <FieldGroup className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 text-white">
      {/* Mobile-Responsive Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-serif font-normal text-white truncate">
              Step 1: Business Profile &amp; Verification
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-300 font-light truncate sm:whitespace-normal">
              Provide your official business identity, location, and legal documents.
            </p>
          </div>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/25 shrink-0">
          Identity Setup
        </span>
      </div>

      {/* Business Identity Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <Field className="sm:col-span-1">
          <FieldLabel className="text-xs font-medium text-zinc-300 tracking-wide">
            Service Category
          </FieldLabel>
          <Select
            onValueChange={(value) =>
              setValue("serviceType", value as serviceTypeEnumProps)
            }
            defaultValue={watch("serviceType") || ""}
            value={watch("serviceType")}
          >
            <SelectTrigger className={cn(inputClasses, "font-medium")}>
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/15 text-white">
              <SelectItem value="hotel">🏨 Hotel / Stay Hospitality</SelectItem>
              <SelectItem value="tour">🗺️ Tour &amp; Travel Agency</SelectItem>
            </SelectContent>
          </Select>
          {errors.serviceType && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.serviceType.message}
            </p>
          )}
        </Field>

        <Field className="sm:col-span-1">
          <FieldLabel
            htmlFor="businessName"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Business / Trade Name
          </FieldLabel>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="businessName"
              placeholder="e.g. Grand Plaza Resort"
              {...register("businessName")}
              className={cn(
                inputClasses,
                "pl-10",
                errors.businessName && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
          </div>
          {errors.businessName && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.businessName.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel
            htmlFor="businessEmail"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Business Email
          </FieldLabel>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="businessEmail"
              type="email"
              placeholder="contact@business.com"
              {...register("businessEmail")}
              className={cn(
                inputClasses,
                "pl-10",
                errors.businessEmail && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
          </div>
          {errors.businessEmail && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.businessEmail.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel
            htmlFor="businessPhone"
            className="text-xs font-medium text-zinc-300 tracking-wide"
          >
            Business Phone
          </FieldLabel>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              id="businessPhone"
              type="tel"
              placeholder="+91 98765 43210"
              {...register("businessPhone")}
              className={cn(
                inputClasses,
                "pl-10",
                errors.businessPhone && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
          </div>
          {errors.businessPhone && (
            <p className="text-xs font-medium text-rose-400 mt-1.5">
              {errors.businessPhone.message}
            </p>
          )}
        </Field>
      </div>

      <hr className="border-white/10" />

      {/* Location Section - Responsive flex stack */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Business Location</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-light">
              Official operating address for verification &amp; tax compliance.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLocating}
            onClick={handleGetCurrentLocation}
            className="w-full sm:w-auto gap-2 text-xs h-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 shrink-0"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {isLocating ? "Locating..." : "Use Current Location"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Field className="sm:col-span-3">
            <FieldLabel
              htmlFor="businessAddress"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              Full Street Address
            </FieldLabel>
            <Input
              id="businessAddress"
              placeholder="Street name, landmark, building number"
              {...register("businessAddress")}
              className={cn(
                inputClasses,
                errors.businessAddress && "border-rose-500 focus:ring-rose-500/20"
              )}
            />
            {errors.businessAddress && (
              <p className="text-xs font-medium text-rose-400 mt-1.5">
                {errors.businessAddress.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="city"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              City
            </FieldLabel>
            <Input
              id="city"
              placeholder="e.g. Mumbai"
              {...register("city")}
              className={inputClasses}
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="state"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              State
            </FieldLabel>
            <Input
              id="state"
              placeholder="e.g. Maharashtra"
              {...register("state")}
              className={inputClasses}
            />
          </Field>

          <Field>
            <FieldLabel
              htmlFor="country"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              Country
            </FieldLabel>
            <Input
              id="country"
              placeholder="India"
              {...register("country")}
              className={inputClasses}
            />
          </Field>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Verification Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Legal Identification &amp; KYC</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 font-light">
            Upload clear photos or scans of your identity documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Field>
            <FieldLabel
              htmlFor="panNumber"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              PAN Card Number
            </FieldLabel>
            <Input
              id="panNumber"
              placeholder="ABCDE1234F"
              {...register("panNumber")}
              className={cn(inputClasses, "font-mono uppercase")}
            />
            {errors.panNumber && (
              <p className="text-xs font-medium text-rose-400 mt-1.5">
                {errors.panNumber.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel
              htmlFor="aadhaarNumber"
              className="text-xs font-medium text-zinc-300 tracking-wide"
            >
              Aadhaar Card Number
            </FieldLabel>
            <Input
              id="aadhaarNumber"
              placeholder="12-digit Aadhaar Number"
              {...register("aadhaarNumber")}
              className={cn(inputClasses, "font-mono")}
            />
            {errors.aadhaarNumber && (
              <p className="text-xs font-medium text-rose-400 mt-1.5">
                {errors.aadhaarNumber.message}
              </p>
            )}
          </Field>
        </div>

        {/* Responsive Document Upload Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
            <ImageField
              label="PAN Card Document"
              docName="panCard"
              onUploadSuccess={(data) => {
                const docs = watch("verificationDocs") || [];
                const updatedDocs = docs.some((d: any) => d.docName === data.name)
                  ? docs.map((d: any) =>
                      d.docName === data.name
                        ? { ...d, docUrl: data.url }
                        : d
                    )
                  : [...docs, { docName: data.name, docUrl: data.url }];
                setValue("verificationDocs", updatedDocs, {
                  shouldValidate: true,
                });
              }}
              onRemove={() => {
                const docs = watch("verificationDocs") || [];
                setValue(
                  "verificationDocs",
                  docs.filter((d: any) => d.docName !== "panCard"),
                  { shouldValidate: true }
                );
              }}
            />
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
            <ImageField
              label="Aadhaar Front Document"
              docName="aadhaarFront"
              onUploadSuccess={(data) => {
                const docs = watch("verificationDocs") || [];
                const updatedDocs = docs.some((d: any) => d.docName === data.name)
                  ? docs.map((d: any) =>
                      d.docName === data.name
                        ? { ...d, docUrl: data.url }
                        : d
                    )
                  : [...docs, { docName: data.name, docUrl: data.url }];
                setValue("verificationDocs", updatedDocs, {
                  shouldValidate: true,
                });
              }}
              onRemove={() => {
                const docs = watch("verificationDocs") || [];
                setValue(
                  "verificationDocs",
                  docs.filter((d: any) => d.docName !== "aadhaarFront"),
                  { shouldValidate: true }
                );
              }}
            />
          </div>
        </div>
      </div>
    </FieldGroup>
  );
};
