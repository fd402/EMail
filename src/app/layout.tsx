import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plainly | Free HTML Email Builder",
  description: "Create beautiful, responsive HTML emails in seconds. No coding required. drag & drop editor, professional templates, and instant export.",
  icons: {
    icon: '/logo.png',
  },
};

import { AuthProvider } from "@/components/AuthProvider";
import { SubscriptionProvider } from "@/components/auth/SubscriptionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <SubscriptionProvider>{children}</SubscriptionProvider>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
