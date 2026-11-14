'use client';

import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MessageModal } from "@/app/(dashboard)/(categories)/rooms/_components/RoomsListing";
import { PageSkeleton } from "@/app/(dashboard)/(categories)/rooms/_components/details.skeleton";
import AnimatedStepper from "../_components/steeper";

import { useSignUp } from "../hooks/use-signup";
import { useProcessContext } from "@/context/auth/ProcessContextProvider";
import { useAuthStore } from "@/stores/auth.store";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import ProcessButtonHandler from "../_components/processButtonHandler";
import { useCurrentUser } from "@/services/queryes";
import { Step2Skeleton, Step3Skeleton, ReviewSkeleton } from "../_components/skeletons";
import { vendorAccessToken } from "@/services/auth";
import WatermelonAuthShell from "@/components/auth/watermelon-auth-shell";

/* Dynamic imports (SSR disabled) */
const Step_1 = dynamic(() => import("../_components/step-1").then(m => m.Step_1), { ssr: false });
const Step_2 = dynamic(() => import("../_components/step-2").then(m => m.Step_2), { ssr: false });
const Step_3_hotel = dynamic(() => import("../_components/step-3").then(m => m.Step_3_hotel), { ssr: false });
const Step_3_cab = dynamic(() => import("../_components/step-3").then(m => m.Step_3_cab), { ssr: false });
const Step_3_bike = dynamic(() => import("../_components/step-3").then(m => m.Step_3_bike), { ssr: false });
const Step_3_tour = dynamic(() => import("../_components/step-3").then(m => m.Step_3_tour), { ssr: false });
const Step_3_adventure = dynamic(() => import("../_components/step-3").then(m => m.Step_3_adventure), { ssr: false });

export default function Process() {
  const { currentStep, setCurrentStep } = useProcessContext();
  const router = useRouter();
  const { data: userRes, isLoading } = useCurrentUser();
  const { currStep } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(vendorAccessToken);

      if (!token && !isLoading && !userRes?.data) {
        router.replace("/login");
      }
    }

    if (currStep && currStep !== currentStep) {
      setCurrentStep(currStep);
    }
  }, [currStep, currentStep, setCurrentStep, router, isLoading, userRes]);

  return (
    <ErrorBoundary fallback={<MessageModal title="Error" description="Something went wrong" />}>
      <Suspense fallback={<PageSkeleton />}>
        <WatermelonAuthShell
          categoryTag="Partner Onboarding"
          editorialSubtitle="PARTNER ONBOARDING"
          editorialTitle="Setup your hospitality business in 3 simple steps"
          editorialDescription="A refined onboarding suite to establish your business identity, configure settlement bank accounts, and showcase your luxury properties."
          isWide={true}
          topElement={<AnimatedStepper currentStep={currentStep} />}
          rightContainerClassName="w-full max-w-3xl xl:max-w-4xl"
        >
          <SignupForm />
        </WatermelonAuthShell>
      </Suspense>
    </ErrorBoundary>
  );
}

function SignupForm() {
  const { currentStep, setCurrentStep } = useProcessContext();
  const { methods, onHandleSubmit, loading, submitStep_1, submitStep_2, submitStep_3 } = useSignUp();

  return (
    <Form {...methods}>
      <form onSubmit={onHandleSubmit} className="space-y-8">
        <FullProcessForm methods={methods} loading={loading} />

        {[2, 3, 4].includes(currentStep) && (
          <div className="pt-2 border-t border-white/10"></div>
        )}

        <ProcessButtonHandler
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          methods={methods}
          loading={loading}
          submitStep_1={submitStep_1}
          submitStep_2={submitStep_2}
          submitStep_3={submitStep_3}
        />
      </form>
    </Form>
  );
}

const FullProcessForm = ({ methods, loading }: { methods: any; loading: boolean }) => {
  const { currentStep } = useProcessContext();
  const router = useRouter();
  const { data: u } = useCurrentUser();
  const serviceType = methods.watch("serviceType");

  if (loading) {
    switch (currentStep) {
      case 2:
        return <Step2Skeleton />;
      case 3:
        return <Step3Skeleton />;
      case 4:
        return <ReviewSkeleton />;
      default:
        return <ReviewSkeleton />;
    }
  }

  switch (currentStep) {
    case 2:
      return <Step_1 currentStep={currentStep} methods={methods} />;

    case 3:
      return <Step_2 currentStep={currentStep} methods={methods} />;

    case 4:
      switch (serviceType) {
        case "cab":
          return <Step_3_cab currentStep={currentStep} methods={methods} />;
        case "bike":
          return <Step_3_bike currentStep={currentStep} methods={methods} />;
        case "tour":
          return <Step_3_tour currentStep={currentStep} methods={methods} />;
        case "adventure":
          return <Step_3_adventure currentStep={currentStep} methods={methods} />;
        case "hotel":
        default:
          return <Step_3_hotel currentStep={currentStep} methods={methods} />;
      }

    case 5:
      return (
        <div className="py-12 text-center text-white space-y-4">
          <div className="w-16 h-16 bg-rose-500/15 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-xl font-serif font-normal text-rose-400">
            Application {u?.data?.data?.vendor?.status || "Declined"}
          </h1>
          <p className="text-zinc-300 font-light text-xs max-w-sm mx-auto leading-relaxed">
            Please contact partner support for more details regarding your registration review.
          </p>
          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={() => router.push("/login")}
          >
            Return to Login
          </Button>
        </div>
      );

    default:
      return (
        <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300 text-white space-y-4">
          <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-2xl font-serif font-normal tracking-tight">
            Your application is under review
          </h1>

          <p className="text-zinc-300 font-light text-xs max-w-sm leading-relaxed">
            Our team is verifying your business and KYC documents. We will notify you via email as soon as your properties are activated.
          </p>

          <Button
            variant="outline"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 mt-2"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.clear();
              }
              router.push("/login");
            }}
          >
            Return to Login
          </Button>
        </div>
      );
  }
};
