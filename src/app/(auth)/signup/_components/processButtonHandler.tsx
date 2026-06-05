import { Button } from "@/components/ui/button";
// import { useSignUp } from '@/hooks/auth/use-signup'
import type { SignUpProps } from "@/schema/auth";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useSignUp } from "../hooks/use-signup";
import { Spinner } from "@/components/ui/spinner";

const ProcessButtonHandler = ({
    currentStep,
    setCurrentStep,
    methods,
}: {
    currentStep: number;
    methods: UseFormReturn<SignUpProps>;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const { getValues } = methods;

    const { submitStep_1, submitStep_2, submitStep_3, loading } = useSignUp();
    switch (currentStep) {

        case 2:
            return (
                <Button
                    type="submit"
                    variant={"default"}
                    className="w-full"
                    disabled={loading}
                    {...(
                        true && {
                            onClick: () => {
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
                                    setCurrentStep);
                            },
                        })}
                >
                    {
                        loading ? <Spinner /> : "submit business details"
                    }
                </Button>
            )
        case 3:
            return (
                <Button
                    type="submit"
                    variant={"default"}
                    className="w-full"
                    disabled={loading}
                    {...(
                        true && {
                            onClick: () => {
                                submitStep_2(
                                    getValues("bankName"),
                                    getValues("accountNumber"),
                                    getValues("ifscCode"),
                                    getValues("branchName"),
                                    getValues("accountHolderName"),
                                    getValues("bankProof"),
                                    setCurrentStep);
                            },
                        })}
                >
                    {
                        loading ? <Spinner /> : "submit bank details"
                    }
                </Button>
            )
        case 4:
            return (
                <Button
                    type="submit"
                    variant={"default"}
                    className="w-full"
                    disabled={loading}
                    {...(
                        true && {
                            onClick: () => {
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
                                    { adventureCategory: getValues("adventureCategory") }
                                );
                            },
                        })}
                >
                    {
                        loading ? <Spinner /> : "Save and submit"
                    }
                </Button>
            )
    }
    return (
        <div className="flex items-center justify-center">
            <p className="text-center">
                Please wait for the response
            </p>
        </div>
        // <Button
        //     type="submit"
        //     variant={"default"}
        //     className="w-full"
        //     {...(
        //         true && {
        //             onClick: () => {
        //                 submitStep_4(setCurrentStep);
        //             },
        //         })}
        // >
        //     Save and submit
        // </Button>
    );
};

export default ProcessButtonHandler;
