import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";
import {
  SIWSolContext,
} from "./siwsol-context";
import { SIWSolConfig, SIWSolSession, SIWSolStatusState } from "./utils";

type Props = SIWSolConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWSolSession) => void;
  onSignOut?: () => void;
};

export const SIWSolProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  onSignIn,
  onSignOut,
  ...siwsolConfig
}: Props) => {
  const [status, setStatus] = useState<SIWSolStatusState>(SIWSolStatusState.READY);
  const resetStatus = () => setStatus(SIWSolStatusState.READY);

  // Ensure only one instance of the provider
  if (useContext(SIWSolContext)) {
    throw new Error(
      "Multiple, nested usages of SolanaSignInProvider detected."
    );
  }

  // Fetch the nonce and session data at specified intervals
  const nonce = useQuery({
    queryKey: ["solanaNonce"],
    queryFn: () => siwsolConfig.getNonce(),
    enabled: false, // Prevent automatic fetching
  });

  const session = useQuery({
    queryKey: ["solanaSession"],
    queryFn: () => siwsolConfig.getSession(),
    enabled: false, // Prevent automatic fetching
  });

  const sessionData = session.data;
  const { publicKey, connected, signIn: signInRoot } = useWallet();

  const { chain } = {
    chain: {
      id: "1040",
    },
  }


  const getChainId = (chainId: string) => {
    if (chainId === "1040") {
      return "mainnet";
    }
    if (chainId === "1041") {
      return "testnet";
    }
    if (chainId === "1042") {
      return "devnet";
    }
    return "mainnet";
  };

  const chainId = getChainId(chain.id.toString());

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(SIWSolStatusState.LOADING);
    if (!(await siwsolConfig.signOut())) {
      throw new Error("Failed to sign out.");
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(SIWSolStatusState.READY);
    onSignOut?.();
    return true;
  };

  const onError = (error: any) => {
    console.error("signIn error", error.message);
    setStatus(
      error.message === "User rejected request"
        ? SIWSolStatusState.REJECTED
        : SIWSolStatusState.ERROR
    );
  };

  const fetchNonce = async () => {
    const { data } = await nonce.refetch();
    return data;
  };

  const signIn = async () => {
    try {
      if (!siwsolConfig) {
        throw new Error("SIWSol not configured");
      }

      const nonceValue = await fetchNonce();

      if (!nonceValue) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(SIWSolStatusState.LOADING);

      if (!publicKey) throw new Error("No public key found");
      if (!nonceValue) throw new Error("Could not fetch nonce");

      setStatus(SIWSolStatusState.LOADING);

      // Correct usage with await to ensure `input` is a resolved object, not a Promise
      const input = await siwsolConfig.createMessage({
        nonce: nonceValue,
        address: publicKey.toBase58(),
        chainId: chainId,
      });

      // Sign message with the wallet
      if (!signInRoot) {
        throw new Error("signInRoot is undefined");
      }
      const output = await signInRoot(input);
      const account = {
        publicKey: output.account.publicKey,
        address: output.account.address,
        chains: [],
        features: [],
      };
      const constructPayload = JSON.stringify({ input, output, account });

      const deconstructPayload: {
        input: SolanaSignInInput;
        output: SolanaSignInOutput;
      } = JSON.parse(constructPayload);
      const backendInput = deconstructPayload.input;
      const backendOutput: SolanaSignInOutput = {
        account: {
          publicKey: new Uint8Array(output.account.publicKey),
          address: output.account.address,
          chains: [],
          features: [],
        },
        signature: new Uint8Array(output.signature),
        signedMessage: new Uint8Array(output.signedMessage),
      };

      if (!verifySignIn(backendInput, backendOutput)) {
        console.error("Sign In verification failed!");
        throw new Error("Sign In verification failed!");
      }

      if (!(await siwsolConfig.verifyMessage({ payload: constructPayload }))) {
        throw new Error("Error verifying signature");
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(SIWSolStatusState.READY);
      return data as SIWSolSession;
    } catch (error) {
      onError(error);
      return false;
    }
  };

  useEffect(() => {
    // If the user disconnects the wallet, sign out
    if (!connected && signOutOnDisconnect) {
      signOutAndRefetch();
    }

    // Sign out if the wallet public key changes
    if (
      signOutOnAccountChange &&
      sessionData?.address &&
      publicKey?.toBase58() !== sessionData.address
    ) {
      console.warn("Wallet account changed, signing out of session");
      signOutAndRefetch();
    }
  }, [
    connected,
    publicKey,
    sessionData,
    signOutOnDisconnect,
    signOutOnAccountChange,
  ]);

  return (
    <SIWSolContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange: siwsolConfig.signOutOnNetworkChange ?? false,
        ...siwsolConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
      }}
    >
      {children}
    </SIWSolContext.Provider>
  );
};
