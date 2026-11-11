import type { Metadata } from "next";
import "./globals.css";
import MainProvider from "@/providers/main-provider/main-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Trivllo Partner Portal | Vendor Dashboard",
  description: "Official Partner & Vendor Management Portal for Trivllo.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans antialiased">
      <body className="font-sans antialiased">
        <MainProvider>

          {children}
          <Toaster />
        </MainProvider>
      </body>
    </html>
  );
}
