"use client";
import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { ErrorBoundary } from "react-error-boundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { CompactFooter } from "@/components/footer/compactfooter";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoLoader from "@/components/loaders/logoloader";
import { ChartRangesProvider } from "@/context/auth/ChartRangesProvider";
import { vendorAccessToken } from "@/services/auth";

import { useCurrentUser } from "@/services/queryes";

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const { data: userRes, isLoading, refetch } = useCurrentUser();

  const user = userRes?.data;
  const isVendor = Boolean(
    user && (user.vendor || user.role === "vendor" || user.isVendor),
  );
  const hasVendorToken =
    typeof window !== "undefined" &&
    Boolean(localStorage.getItem(vendorAccessToken));

  // If token is stored in localStorage but query hasn't populated, refetch
  useEffect(() => {
    if (hasVendorToken && !user && !isLoading) {
      refetch();
    }
  }, [hasVendorToken, user, isLoading, refetch]);

  useEffect(() => {
    if (isLoading) return;

    if (!hasVendorToken) {
      setOk(false);
      router.replace("/login");
      return;
    }

    if (user && !isVendor) {
      setOk(false);
      router.replace("/login");
      return;
    }

    if (user && isVendor) {
      const status = user?.vendor?.status || user?.status || localStorage.getItem("status");
      if (status === "draft" || status === "pending" || status === "rejected") {
        router.replace("/signup/process");
        return;
      }
      setOk(true);
    }
  }, [hasVendorToken, isVendor, user, isLoading, router]);

  if (!ok || !hasVendorToken || !isVendor) return <LogoLoader />;
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "16rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" className="border-border bg-background" />
      <SidebarInset className="bg-gray-50 dark:bg-zinc-900">
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <SiteHeader />
        </ErrorBoundary>
        <ChartRangesProvider>
          <div className="flex flex-1 flex-col px-2">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {/* <div className="flex flex-col gap-4 p-2 md:gap-6 md:p-2  rounded-xl min-h-screen"> */}
              {children}

              {/* </div> */}
              <CompactFooter />
            </div>
          </div>
        </ChartRangesProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
