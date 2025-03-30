
import "@/styles/globals.css";
import { GeistMono, GeistSans } from "@/styles/fonts";
import { cn, constructMetadata } from "@/lib/utils";
import type { Viewport } from "next";
import { headers } from "next/headers";

import React from "react";
import {
  HOME_HOSTNAMES,
} from "@/lib/constants";

import { AppProviders, UIProviders } from "./providers";
import Nav from "@/components/home/nav";
import Footer from "@/components/home/app-footer";

export const metadata = constructMetadata();

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode | any;
}) {
  const headersList = await headers();
  const activePath = headersList.get("x-forwarded-host");

  const determineClasses = () => {
    if (activePath && HOME_HOSTNAMES.has(activePath)) {
      return {
        htmlClass: null,
        bodyClass: `bg-background-accent` as string | undefined,
      };
    }
    return { htmlClass: null, bodyClass: undefined };
  };

  const { bodyClass } = determineClasses();

  return (
    <AppProviders>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(GeistMono.variable, GeistSans.variable)}
      >
        <body className={bodyClass}>
          <UIProviders>

            <div className="flex min-h-[100dvh] flex-col justify-between">
              <Nav location="home" />
              {children}
              <Footer />
            </div>

          </UIProviders>
        </body>
      </html>
    </AppProviders>
  );
}
