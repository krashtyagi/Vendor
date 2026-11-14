"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LOGO from "@/components/logo/logo";
import { useCurrentUser } from "@/services/queryes";
import { useAuthStore } from "@/stores/auth.store";
import { useLogin } from "@/hooks/auth/use-sign";
import { vendorAccessToken } from "@/services/auth";
import trivlloData from "@/../trivllo.json";
import { PageSkeleton } from "@/app/(dashboard)/(categories)/rooms/_components/details.skeleton";
import { MessageModal } from "@/app/(dashboard)/(categories)/rooms/_components/RoomsListing";
import WatermelonAuthShell from "@/components/auth/watermelon-auth-shell";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const { draft } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const user = data?.data;
    const isVendor = Boolean(
      user && (user.vendor || user.role === "vendor" || user.isVendor),
    );
    const hasVendorToken =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(vendorAccessToken));

    if (hasVendorToken && isVendor) {
      const status =
        user?.vendor?.status || user?.status || localStorage.getItem("status");
      if (status === "draft" || status === "pending" || status === "rejected") {
        router.push("/signup/process");
      } else {
        router.push("/dashboard");
      }
    }
  }, [data, isLoading, draft, router]);

  return (
    <ErrorBoundary
      fallback={
        <MessageModal title="Error" description="Something went wrong" />
      }
    >
      <Suspense fallback={<PageSkeleton />}>
        <WatermelonAuthShell
          categoryTag="Vendor Suite"
          editorialSubtitle="YOU CAN EASILY"
          editorialTitle="Manage all your properties from a single command center"
          editorialDescription="A high-performance hospitality suite engineered for luxury resorts, boutique stays, and premier hotel chains."
          rightContainerClassName="max-w-md"
        >
          <LoginForm />
        </WatermelonAuthShell>
      </Suspense>
    </ErrorBoundary>
  );
}

function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { onHandleSubmit, methods, loading } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className={cn("w-full space-y-6", className)} {...props}>
      <Form {...methods}>
        <form onSubmit={onHandleSubmit} className="space-y-6">
          <FieldGroup className="space-y-5">
            {/* Title Block with Premium Styling */}
            <div>
              <h1 className="text-2xl sm:text-xl font-serif font-normal tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-1.5 text-xs sm:text-xm text-zinc-300/85 font-light leading-relaxed tracking-wide">
                Sign in to manage hotels, bookings &amp; financial settlements.
              </p>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-medium text-zinc-300 tracking-wide"
              >
                Email address
              </label>
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          id="login-email"
                          type="email"
                          placeholder="e.g. partner@hotel.com"
                          disabled={loading}
                          {...field}
                          className="w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-5 py-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:outline-none focus:ring-2 focus:ring-[#0084ff]/20 transition-all disabled:opacity-50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400 pl-3 pt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-medium text-zinc-300 tracking-wide"
                >
                  Password
                </label>
                <Link
                  href="/resetpassword"
                  className="text-xs font-normal text-zinc-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          disabled={loading}
                          {...field}
                          className="w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-11 py-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#0084ff] focus:outline-none focus:ring-2 focus:ring-[#0084ff]/20 transition-all disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-rose-400 pl-3 pt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-md border-white/20 bg-white/5 text-[#0084ff] focus:ring-[#0084ff]/20 accent-[#0084ff]"
              />
              <label
                htmlFor="remember-me"
                className="text-xs text-zinc-300 font-light cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Clean Solid Blue Submit Button (No colorful rainbow gradient) */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#0084ff] hover:bg-[#0074e8] text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Vendor Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </FieldGroup>
        </form>
      </Form>

      {/* Don't have an account */}
      <div className="text-center pt-2 border-t border-white/10">
        <p className="text-xs text-zinc-400 font-light">
          Don&apos;t have a vendor account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#0084ff] hover:text-sky-300 hover:underline"
          >
            Register as Partner
          </Link>
        </p>
      </div>
    </div>
  );
}
