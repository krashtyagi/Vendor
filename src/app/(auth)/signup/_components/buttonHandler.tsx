import { Button } from "@/components/ui/button";
// import { useSignUp } from '@/hooks/auth/use-signup'
import type { SignUpProps } from "@/schema/auth";
import React from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { useSignUp } from "../hooks/use-signup";

const ButtonHandler = ({
  currentStep,
  setCurrentStep,
  methods,
}: {
  currentStep: number;
  methods: UseFormReturn<SignUpProps>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { formState, getFieldState, getValues } = methods;
  const { isDirty: isEmail } = getFieldState("email", formState);
  const { isDirty: isPassword } = getFieldState("password", formState);
  const { isDirty: isConfirmPassword } = getFieldState(
    "confirmPassword",
    formState,
  );
  const { isDirty: isVerificationDocs } = getFieldState(
    "verificationDocs",
    formState,
  );

  const { isDirty: isDob } = getFieldState("dob", formState);
  const { isDirty: otp } = getFieldState("otp", formState);
  const { onGenerateOtp, veryOtp, loading } = useSignUp();
  switch (currentStep) {
    case 1:
      return (
        <Button
        disabled={loading}
          type="submit"
          variant={"default"}
          className="w-full"
          {...(isEmail &&
            // isZipCode &&
            // isFirstName &&
            // isLastName &&
            // isPhoneNumber &&
            // isGender &&
            // isDob &&
            // isCountry &&
            // isAddress &&
            isPassword &&
            isConfirmPassword && {
            onClick: () => {
              onGenerateOtp(
                getValues("email"),
                getValues("password"),
                getValues("role"),
                getValues("firstName"),
                getValues("lastName"),
                getValues("phoneNumber"),
                // getValues("gender"),
                // getValues("dob"),
                // getValues("country"),
                // getValues("address"),
                // getValues("zipcode"),
                setCurrentStep,
              );
            },
          })}
        >
          {
            loading ? "Loading..." : "Get otp"
          }
        </Button>
      );
  }

  return (
    <Button
      disabled={loading}
      type="submit"
      variant={"default"}
      className="w-full"
      {...(
        {
          onClick: () => {
            veryOtp(getValues("email"), getValues("otp"), setCurrentStep);
          },
        })}
    >
      {loading ? "Loading..." : "Verify otp"}
    </Button>
  )

};

export default ButtonHandler;
