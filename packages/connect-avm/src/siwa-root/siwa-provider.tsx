import React, { ReactNode, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";
import { useNetwork, useWallet } from '@txnlab/use-wallet-react'

import {
  SIWAContext,
} from "./siwa-context";
import { resolveAddressToNFD } from "@avmkit/siwa";
import { SIWAConfig, SIWASession, SIWAStatusState } from "./utils";

if (typeof window !== "undefined") {
  // Ensure Buffer is defined in the browser
  (window as any).Buffer = Buffer;
}

type Props = SIWAConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWASession) => void;
  onSignOut?: () => void;
};

declare let window: {
  Buffer: any;
  algorand: any;
  location: Location;
  localStorage: Storage;
};

function uint8ArrayToBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
}


/**
 * Convert a string message to a Uint8Array
 * @param message - The message to convert
 * @returns The message as a Uint8Array
 */
function getMessageBytes(message: string): Uint8Array {
  return new Uint8Array(Buffer.from(message, "utf8"));
}

/**
 * Hash a message string
 * @param message - The message to hash
 * @returns The hashed message as a Uint8Array
 */
function hashMessage(message: string): Uint8Array {
  return new Uint8Array(Buffer.from(JSON.stringify(message), "utf8"));
}

function getChainIdForRpc(rpc: any) {
  if (!rpc) return null;
  switch (rpc) {
    case "https://mainnet-api.4160.nodely.dev":
      return 1000;
    case "https://testnet-api.4160.nodely.dev":
      return 1005;
    case "https://mainnet-api.voi.nodely.dev":
      return 1010;
    case "https://testnet-api.voi.nodely.dev":
      return 1015;
    default:
      return null;
  }
}

export const SIWAProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  ...siwaConfig
}: Props) => {

  const { activeAddress, activeWallet } = useWallet();
  const {
    signTransactions,
    algodClient
  } = useWallet()
  const { activeNetwork, networkConfig } = useNetwork();

  const activeNet = networkConfig[activeNetwork];
  const chainId = getChainIdForRpc(activeNet?.algod?.baseServer) || 1000;
  const address = activeAddress || "";
  const provider = activeWallet?.id || "";

  const [status, setStatus] = useState<SIWAStatusState>(SIWAStatusState.READY);
  const resetStatus = () => setStatus(SIWAStatusState.READY);

  // Only allow for mounting SIWAProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWAContext)) {
    throw new Error(
      "Multiple, nested usages of SIWAProvider detected. Please use only one.",
    );
  }

  const nonce = useQuery({
    queryKey: ["ckSiwaNonce"],
    queryFn: () => siwaConfig.getNonce(),
    enabled: false, // Prevent automatic fetching
  });

  const session = useQuery({
    queryKey: ["ckSiwaSession"],
    queryFn: () => siwaConfig.getSession(),
    refetchInterval: sessionRefetchInterval,
    enabled: false, // Prevent automatic fetching
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(SIWAStatusState.LOADING);
    console.log("Signing out...");
    try {
      const signOutResult = await siwaConfig.signOut();
      console.log("Sign out result:", signOutResult);
      if (!signOutResult) {
        throw new Error("Failed to sign out.");
      }
      await Promise.all([session.refetch(), nonce.refetch()]);
      console.log("Sign out successful.");
      setStatus(SIWAStatusState.READY);
      onSignOut?.();
      return true;
    } catch (error) {
      console.error("Error during sign out:", error);
      setStatus(SIWAStatusState.ERROR);
      return false;
    }
  };

  const onError = (error: any) => {
    console.error("signIn error", error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case "ACTION_REJECTED": // MetaMask: user rejected
        setStatus(SIWAStatusState.REJECTED);
        break;
      default:
        setStatus(SIWAStatusState.ERROR);
    }
  };


  const fetchNonce = async () => {
    if (!nonce.isFetching && !nonce.isLoading) {
      const { data } = await nonce.refetch();
      return data;
    }
    return nonce.data; // Return cached nonce if available
  };

  const signIn = async () => {
    const nfd = await resolveAddressToNFD(address);

    try {
      if (!siwaConfig) {
        throw new Error("SIWA not configured");
      }

      const nonceValue = await fetchNonce();

      if (!nonceValue) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(SIWAStatusState.LOADING);

      if (!address) throw new Error("No address found");
      if (!chainId) throw new Error("No chainId found");

      if (!nonceValue) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(SIWAStatusState.LOADING);

      const message = siwaConfig.createMessage({
        address,
        chainId,
        nonce: nonceValue,
      });

      const hashedMessage = hashMessage(message);
      const encodedHashedMessage = getMessageBytes(Buffer.from(hashedMessage).toString("utf8"));

      let algoSig: Uint8Array | null = null as any;
      let encodedTransaction: string | null = null;
      try {

        const suggestedParams = await algodClient.getTransactionParams().do()
        if (!suggestedParams || !activeAddress) {
          console.error("Suggested params are not available for...", provider);
          throw new Error("Suggested params are not available");
        }

        const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          note: encodedHashedMessage,
          sender: activeAddress,
          receiver: activeAddress,
          amount: 0,
          suggestedParams
        })

        // Sign transaction
        const signedTxns = await signTransactions([transaction])
        if (!signedTxns || signedTxns.length === 0) {
          throw new Error("Failed to sign transaction");
        }
        if (!signedTxns[0]) {
          throw new Error("Signed transaction is null");
        }
        const decodedTxn = algosdk.decodeSignedTransaction(signedTxns[0]);
        algoSig = decodedTxn.sig as unknown as Uint8Array;
        encodedTransaction = uint8ArrayToBase64(signedTxns[0]) as string;
      }
      catch (error) {
        console.error("Error during signing process:", error);
      }

      // Construct the verifyMessage parameters conditionally
      let algoSigBase64 = algoSig && uint8ArrayToBase64(algoSig);

      if (!algoSigBase64) {
        throw new Error("No signature found");
      }

      if (!encodedTransaction) {
        throw new Error("No transaction found");
      }

      // Construct the verifyMessage parameters conditionally
      const verifyParams = {
        message: message,
        signature: algoSigBase64,
        domain: typeof window !== "undefined" ? window.location.host : "",
        transaction: encodedTransaction,
        nfd: undefined as string | undefined,
      };

      if (nfd) {
        verifyParams.nfd = nfd;
      } else {
        verifyParams.nfd = undefined;
      }

      // Verify signature
      if (!(await siwaConfig.verifyMessage(verifyParams))) {
        throw new Error("Error verifying SIWA signature");
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(SIWAStatusState.READY);
      return data as SIWASession;
    } catch (error) {
      onError(error);
      console.error("Error during signIn:", error);
      setStatus(SIWAStatusState.ERROR);
      return false;
    }
  };

  return (
    <SIWAContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwaConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
      }}
    >
      {children}
    </SIWAContext.Provider>
  );
};
