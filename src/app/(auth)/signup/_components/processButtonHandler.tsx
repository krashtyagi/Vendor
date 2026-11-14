"use client";

import { Button } from "@/components/ui/button";
import type { SignUpProps } from "@/schema/auth";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

const ProcessButtonHandler = ({
  currentStep,
  setCurrentStep,
  methods,
  loading,
  submitStep_1,
  submitStep_2,
  submitStep_3,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  submitStep_1: any;
  submitStep_2: any;
  submitStep_3: any;
}) => {
  const { getValues } = methods;
  const { setCurrStep } = useAuthStore();

  switch (currentStep) {
    case 2:
      return (
        <Button
          type="submit"
          className="w-full h-11 sm:h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          disabled={loading}
          onClick={async (e) => {
            e.preventDefault();
            const isValid = await methods.trigger([
              "serviceType",
              "businessName",
              "businessEmail",
              "businessPhone",
              "businessAddress",
              "city",
              "state",
              "panNumber",
              "aadhaarNumber",
              "verificationDocs",
            ]);
            if (!isValid) {
              toast.error("Please fill in all required business details.");
              return;
            }
            submitStep_1(
              getValues("serviceType"),
              getValues("businessName"),
              getValues("businessEmail"),
              getValues("businessPhone"),
              getValues("businessAddress"),
              getValues("city"),
              getValues("state"),
              getValues("country"),
              getValues("panNumber"),
              getValues("aadhaarNumber"),
              getValues("verificationDocs"),
              setCurrentStep
            );
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Business Details...</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Save &amp; Continue to Bank Account</span>
              <span className="sm:hidden">Continue to Bank Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      );

    case 3:
      return (
        <div className="flex gap-2 sm:gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            className="w-24 sm:w-1/3 h-11 sm:h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-medium cursor-pointer shrink-0"
            disabled={loading}
            onClick={() => {
              setCurrentStep(2);
              setCurrStep(2);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 sm:h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer px-2 sm:px-4"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();
              const isValid = await methods.trigger([
                "bankName",
                "accountNumber",
                "ifscCode",
                "branchName",
                "accountHolderName",
                "bankProof",
              ]);
              if (!isValid) {
                toast.error("Please fill in all bank details correctly.");
                return;
              }
              submitStep_2(
                getValues("bankName"),
                getValues("accountNumber"),
                getValues("ifscCode"),
                getValues("branchName"),
                getValues("accountHolderName"),
                getValues("bankProof"),
                setCurrentStep
              );
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Saving Bank Account...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Save &amp; Proceed to Property Setup</span>
                <span className="sm:hidden">Continue to Property</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      );

    case 4:
      return (
        <div className="flex gap-2 sm:gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            className="w-24 sm:w-1/3 h-11 sm:h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs font-medium cursor-pointer shrink-0"
            disabled={loading}
            onClick={() => {
              setCurrentStep(3);
              setCurrStep(3);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-11 sm:h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer px-2 sm:px-4"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();
              const isValid = await methods.trigger([
                "name",
                "description",
                "hotelAddress",
                "hotelCity",
                "location",
                "images",
                "documents",
                "amenities",
              ]);
              if (!isValid) {
                const errors = methods.formState.errors;
                let errorMessage = "Please fill in all required property details.";

                if (errors.name?.message)
                  errorMessage = `Name: ${errors.name.message}`;
                else if (errors.description?.message)
                  errorMessage = `Description: ${errors.description.message}`;
                else if (errors.hotelAddress?.message)
                  errorMessage = `Address: ${errors.hotelAddress.message}`;
                else if (errors.hotelCity?.message)
                  errorMessage = `City: ${errors.hotelCity.message}`;
                else if (errors.images?.message)
                  errorMessage = `Gallery: ${errors.images.message}`;
                else if (errors.documents?.message)
                  errorMessage = `Documents: ${errors.documents.message}`;
                else if (errors.amenities?.message)
                  errorMessage = `Amenities: ${errors.amenities.message}`;

                toast.error(errorMessage);
                return;
              }
              submitStep_3(
                getValues("serviceType"),
                getValues("name"),
                getValues("hotelAddress"),
                getValues("description"),
                getValues("amenities") || [],
                getValues("documents") || [],
                getValues("images") || [],
                getValues("hotelCity"),
                getValues("location"),
                setCurrentStep,
                {
                  adventureCategory: getValues("adventureCategory"),
                  logo: getValues("logo"),
                  extraAddress: {
                    buildingName: getValues("buildingName"),
                    doorNumber: getValues("doorNumber"),
                    streetAddress:
                      getValues("streetAddress") || getValues("hotelAddress"),
                    areaName: getValues("areaName"),
                    city: getValues("hotelCity"),
                    district: getValues("district"),
                    state: getValues("state"),
                    postalCode: getValues("postalCode"),
                    country: getValues("country") || "India",
                    landmark: getValues("landmark"),
                    directions: getValues("directions"),
                    formattedAddress:
                      getValues("formattedAddress") ||
                      getValues("hotelAddress"),
                  },
                }
              );
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Submitting Registration...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Complete Registration &amp; Submit</span>
                <span className="sm:hidden">Submit Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <p className="text-xs text-zinc-400 font-light">
        Please wait while we process your request...
      </p>
    </div>
  );
};

export default ProcessButtonHandler;
