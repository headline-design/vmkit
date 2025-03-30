"use client";

import GlobalModalProvider from "@/providers/global-modal-provider";
import Web3AVMProvider from "@/providers/web3/avm-provider";
import Web3EVMProvider from "@/providers/web3/evm-provider";
import Web3SubstrateProvider from "@/providers/web3/substrate-provider";
import Web3SVMProvider from "@/providers/web3/svm-provider";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";


export function AppProviders({
  children,
}: {
  children: React.ReactNode | any;
}) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Web3AVMProvider>
            <Web3EVMProvider>
              <Web3SVMProvider>
                <Web3SubstrateProvider>

                  {children}

                </Web3SubstrateProvider>
              </Web3SVMProvider>
            </Web3EVMProvider>
          </Web3AVMProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  );
}

export function UIProviders({
  children,
}: {
  children: React.ReactNode | any;
}) {

  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: "light", dark: "dark" }}
      defaultTheme="dark"
    >
      <Toaster
        style={{ zIndex: 9999 }}
        toastOptions={{
          unstyled: true,
          duration: 5000,
          classNames: {
            toast: "rust-toaster",
          },
        }}
      />
      <GlobalModalProvider>
        {children}
      </GlobalModalProvider>
    </ThemeProvider>
  );
}
