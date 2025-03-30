import React, { ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SIWSContext,
  SIWSConfig,
  StatusState,
  SIWSSession,
} from "./siws-context";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { Address, SiwsMessage, verifySIWS } from "@talismn/siws";

type Props = SIWSConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWSSession) => void;
  onSignOut?: () => void;
  accounts: InjectedAccountWithMeta[];
  onCancel: () => void;
  onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void;
};

export const SIWSProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  onCancel,
  onSignedIn,
  accounts,
  ...siwsConfig
}: Props) => {
  const [status, setStatus] = useState<StatusState>(StatusState.READY);
  const [selectedAccount, setSelectedAccount] = useState<
    InjectedAccountWithMeta | undefined
  >(accounts?.length === 1 ? accounts[0] : undefined);
  const [signingIn, setSigningIn] = useState(false);
  const resetStatus = () => setStatus(StatusState.READY);

  const nonce = useQuery({
    queryKey: ["ckSiwsNonce"],
    queryFn: () => siwsConfig.getNonce(),
    enabled: false, // Prevent automatic fetching
  });

  const session = useQuery({
    queryKey: ["ckSiwsSession"],
    queryFn: async () => {
      const sessionData = await siwsConfig.getSession();
      return sessionData ?? null; // Ensure a non-undefined value is returned
    },
    enabled: false, // Prevent automatic fetching
  });


  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(StatusState.LOADING);
    if (!(await siwsConfig.signOut())) {
      throw new Error("Failed to sign out.");
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(StatusState.READY);
    onSignOut?.();
    return true;
  };

  const onError = (error: any) => {
    console.error("signIn error", error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case "ACTION_REJECTED": // MetaMask: user rejected
        setStatus(StatusState.REJECTED);
        break;
      default:
        setStatus(StatusState.ERROR);
    }
  };

  useEffect(() => {
    if (accounts?.length === 1) {
      console.log("Auto selecting account", accounts[0]);
      setSelectedAccount(accounts[0]);
    }
  }, [accounts]);



  const fetchNonce = async () => {
    const { data } = await nonce.refetch();
    return data;
  };


  const signIn = async () => {
    try {

      if (!selectedAccount) throw new Error("No account selected!");
      if (!siwsConfig) throw new Error('SIWS not configured');

      const nonceValue = await fetchNonce();

      if (!nonceValue) {
        throw new Error("Could not fetch nonce");
      }

      setStatus(StatusState.LOADING);

      const baseAddress = Address.fromSs58(selectedAccount.address ?? "");
      if (!baseAddress)
       throw new Error("Invalid address");

      setSigningIn(true);

      const siwsMessage = new SiwsMessage({
        domain: typeof window !== "undefined" ? window.location.host : "",
        uri: typeof window !== "undefined" ? window.location.origin : "",
        address: baseAddress.toSs58(0),
        nonce: nonceValue, // Use the fetched nonce
        statement: "Sign In With Substrate to prove you control this wallet.",
        chainName: "Polkadot",
        expirationTime: new Date().getTime() + 2 * 60 * 1000,
      });

      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const injectedExtension = await web3FromSource(
        selectedAccount.meta.source,
      );
      const signed = await siwsMessage.sign(injectedExtension);

      const message = signed.message;
      const signature = signed.signature;
      const address = baseAddress.toSs58(0);

      const response = await verifySIWS(message, signature, address, {
        disableAzeroId: true,
      });

      if (!response) {
        throw new Error("Error verifying SIWS signature");
      }

      if (!(await siwsConfig.verifyMessage({ message, signature, address }))) {
        throw new Error("Error verifying SIWS signature");
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(StatusState.READY);
      onSignedIn(selectedAccount, "");
      return data ?? false;
    } catch (e: any) {
      console.error("Error signing in", e);
      throw new Error(e);
    } finally {
      setSigningIn(false);
    }
  };


  return (
    <SIWSContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siwsConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
        accounts,
        setSelectedAccount,
        selectedAccount,
        signingIn,
        onCancel,
        onError,
      }}
    >
      {children}
    </SIWSContext.Provider>
  );
};
