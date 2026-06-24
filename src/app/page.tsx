'use client'
import { SpinnerCustom } from "@/components/loaders/smallSpinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/services/queryes";
import { PageSkeleton } from "./(dashboard)/(categories)/rooms/_components/details.skeleton";
import { useAuthStore } from "@/stores/auth.store";
import LogoLoader from "@/components/loaders/logoloader";
import { vendorAccessToken } from "@/services/auth";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useCurrentUser();

  const router = useRouter()
  const { setCurrStep } = useAuthStore()

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (data) {
      if (localStorage.getItem("status") === "draft") {
        setCurrStep(data?.data?.vendor.currentStep)
        router.replace("/signup/process")
      } else {
        router.replace("/dashboard")
      }
    } else if (localStorage.getItem(vendorAccessToken) === null) {
      router.replace("/login")
    }
  }, [data, mounted])

  if (!mounted || isLoading) return <LogoLoader />

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SpinnerCustom /> loading
    </div>
  );
}
