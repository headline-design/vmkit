"use client";

import { useState, useCallback, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";

import { useSIWA } from "@vmkit/connect-avm";
import { useSIWE } from "@vmkit/connect-evm";
import { useSIWS } from "@vmkit/connect-substrate";
import { useSIWSol } from "@vmkit/connect-svm";

import { debounce } from "lodash";
import { getCallbackRedirect, getCurrentCallbackUrl } from "../client-utils";
import { siwaConfig } from "@/providers/web3/avm-provider";
import { siweConfig } from "@/providers/web3/evm-provider";
import { siwsolConfig } from "@/providers/web3/svm-provider";
import { siwsConfig } from "@/providers/web3/substrate-provider";

// WIP: Need to refactor client-side logout after server-side logout is implemented

export const useLogout = () => {
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  // Wrap siwState initialization in its own useMemo
  const { data: session } = useSession();
  const { signOut: signOutWithSIWA, data: siwaData } = useSIWA();
  const { signOut: signOutWithSIWE, data: siweData } = useSIWE();
  const { signOut: signOutWithSIWS, data: siwsData } = useSIWS();
  const { signOut: signOutWithSIWSol, data: siwsolData } = useSIWSol();

  const urlCallback = getCurrentCallbackUrl();
  const callbackRedirect = getCallbackRedirect();

  // Create the debounced function using useMemo
  const debouncedDisconnect = useMemo(
    () =>
      debounce(async () => {
        try {
          setLogoutError(null); // Reset error state before attempting logout

          if (siwaData?.address) {
            await siwaConfig.signOut();

            await signOutWithSIWA();
            if (siwaData) {
              siwaData.address = null; // Reflect that the address is now null
            }
          }

          if (siweData?.address || session?.user?.vm === "EVM") {
            await siweConfig.signOut();
            await signOutWithSIWE().then(() => {});
            if (siweData) {
              siweData.address = null; // Reflect that the address is now null
            }
          }

          if (siwsolData?.address || session?.user?.vm === "SVM") {
            await siwsolConfig.signOut();
            await signOutWithSIWSol().then(() => {});
            if (siwsolData) {
              siwsolData.address = null; // Reflect that the address is now null
            }
          }

          if (siwsData?.address || session?.user?.vm === "EVM") {
            await siwsConfig.signOut();
            await signOutWithSIWS().then(() => {});
            if (siwsData) {
              (siwsData.address as any) = null; // Reflect that the address is now null
            }
          }

          if (
            !siwaData?.address &&
            !siweData?.address &&
            !siwsData?.address &&
            !siwsolData?.address
          ) {
            setSigningOut(true);
            await signOut({
              callbackUrl: urlCallback ?? undefined,
              redirect: callbackRedirect,
            });
            setSigningOut(false);
          } else {
            console.log(
              "Either SIWA or useWallet state address was found, not calling signOut",
              siwaData?.address
            );
          }
        } catch (error) {
          console.error("Error during logout:", error);
          setLogoutError("Failed to log out. Please try again." as any);
          setSigningOut(false);
        }
      }, 300),
    [
      siwaData,
      signOutWithSIWA,
      signOutWithSIWE,
      signOutWithSIWS,
      signOutWithSIWSol,
      session,
      urlCallback,
      callbackRedirect,
    ]
  );

  // Memoize the debounced function with useCallback
  const handleDisconnect = useCallback(() => {
    debouncedDisconnect();
  }, [debouncedDisconnect]);

  return { handleDisconnect, signingOut, logoutError };
};
