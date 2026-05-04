import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TradieMatch — The smartest way to find the right tradie",
  description:
    "Australia's smartest way to connect with verified tradies. Swipe, match, build. Plumbers, electricians, carpenters, painters and builders — all ABN-verified, insured, and ready.",
  metadataBase: new URL("https://tradiematch.com.au"),
  openGraph: {
    title: "TradieMatch — Swipe. Match. Build.",
    description:
      "Australia's smartest way to connect with verified tradies.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradieMatch — Swipe. Match. Build.",
    description:
      "Australia's smartest way to connect with verified tradies.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A2540",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-navy">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
