"use client";

import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SIWSConfig, SIWSProvider } from "@vmkit/connect-substrate";
import { Address, SiwsMessage } from "@talismn/siws";
//@ts-ignore
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { getCurrentCallbackUrl } from "@/lib/client-utils";

export interface SIWSCreateMessageArgs {
  nonce: string;
  address: string;
}

declare let window: {
  location: Location;
  localStorage: Storage;
};

export type Web3ContextT = {
  contract: any | null;
  accounts: InjectedAccountWithMeta[] | undefined;
  signedInWith: InjectedAccountWithMeta | undefined;
  jwtToken: string | undefined;
  setJwtToken: (token: string | undefined) => void;
  setAccounts: (accounts: InjectedAccountWithMeta[] | undefined) => void;
  handleSignOut: () => void;
  handleSignedIn: (
    selectedAccount: InjectedAccountWithMeta,
    jwtToken: string,
  ) => void;
};

export const SubstrateContext = createContext<Web3ContextT>({} as Web3ContextT);

export const useSubstrate = () => useContext(SubstrateContext);

export const getDefaultConfig = (config: any) => {
  return {
    setState: () => {},
    connect: () => {},
    appName: "VMkit Connect",
    appIcon: "/favicon.svg",
    appDescription: "VMkit Connect is secure auth for Substrate.",
    appUrl: window.location.origin,
    walletConnectProjectId: "",
    chains: [],
    client: null,
    ...config,
  };
};

export const Web3Contextual = (props: any) => {
  const { children } = props;
  const contract = null;

  return (
    <SubstrateContext.Provider
      value={{
        contract,
        accounts: undefined,
        signedInWith: undefined,
        jwtToken: undefined,
        setJwtToken: () => {},
        setAccounts: () => {},
        handleSignOut: () => {},
        handleSignedIn: () => {},
      }}
    >
      {children}
    </SubstrateContext.Provider>
  );
};

export const Web3SubstrateProvider = ({ children }: { children: any }) => {
  return <Web3ChildProvider>{children}</Web3ChildProvider>;
};

export const siwsConfig: SIWSConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/auth/siws`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWS nonce");

    return res.text();
  },

  createMessage: ({ nonce, address }: SIWSCreateMessageArgs) =>
    new SiwsMessage({
      domain: typeof window !== "undefined" ? window.location.host : "",
      uri: typeof window !== "undefined" ? window.location.origin : "",
      // use prefix of chain your dapp is on:
      address: (address as any).toSs58(0),
      nonce: (nonce as any)?.data,
      statement: "Sign In With Substrate to prove you control this wallet.",
      chainName: "Polkadot",
      // expires in 2 mins
      expirationTime: new Date().getTime() + 2 * 60 * 1000,
    }).prepareMessage(),

  verifyMessage: async ({
    message,
    signature,
    address,
  }: {
    message: string | Uint8Array;
    signature: string;
    address: string;
  }) => {
    const baseAddress = Address.fromSs58(address ?? "");
    const res = await fetch(`/api/auth/siws`, {
      method: "POST",
      body: JSON.stringify({
        message: JSON.stringify(message),
        address: baseAddress ? baseAddress.toSs58(0) : "",
        signature,
      }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("res", res);

    if (!res.ok) throw new Error("Failed to fetch SIWS session");
    const currentCallbackUrl = getCurrentCallbackUrl();

    return await signIn("substrate", {
      message: JSON.stringify(message),
      address: baseAddress ? baseAddress.toSs58(0) : "",
      signature,
      redirect: false,
      callbackUrl: currentCallbackUrl ?? undefined,
    }).then((res) => res?.ok as boolean);
  },
  getSession: async () => {
    try {
      const res = await fetch(`/api/auth/siws`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to fetch SIWS session");
      const { address, chainId } = data;

      return address && chainId ? { address, chainId } : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  signOut: () => fetch(`/api/auth/siws`, { method: "DELETE" }).then((res) => res.ok),
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const [signedInWith, setSignedInWith] = useState<
    InjectedAccountWithMeta | undefined
  >();
  const [accounts, setAccounts] = useState<
    InjectedAccountWithMeta[] | undefined
  >();
  const [jwtToken, setJwtToken] = useState<string | undefined>();
  const [subscribed, setSubscribed] = useState(false);

  const handleSignedIn = (
    selectedAccount: InjectedAccountWithMeta,
    jwtToken: string,
  ) => {
    setJwtToken(jwtToken);
    setSignedInWith(selectedAccount);
  };

  const handleSignOut = useCallback(() => {
    setSignedInWith(undefined);
    setJwtToken(undefined);
  }, []);

  const subscribeToExtensions = useCallback(async () => {
    if (accounts === undefined || subscribed) return;
    const { web3AccountsSubscribe } = await import("@polkadot/extension-dapp");

    setSubscribed(true);
    web3AccountsSubscribe((newAccounts) => {
      const newAddresses = newAccounts
        .map((account) => account.address)
        .join("");
      const oldAddresses = accounts.map((account) => account.address).join("");
      if (newAddresses === oldAddresses) return;

      setAccounts(newAccounts);
    });
  }, [accounts, subscribed]);

  useEffect(() => {
    subscribeToExtensions();
  }, [subscribeToExtensions]);

  useEffect(() => {
    if (
      signedInWith?.address &&
      accounts &&
      !accounts.find((account) => account.address === signedInWith?.address)
    ) {
      handleSignOut();
    }
  }, [accounts, handleSignOut, signedInWith?.address]);

  return (
    <SIWSProvider
      accounts={accounts || []}
      onSignIn={() => router.refresh()}
      onSignOut={() => router.refresh()}
      onSignedIn={handleSignedIn}
      onCancel={() => setAccounts(undefined)}
      {...siwsConfig}
    >
      <SubstrateContext.Provider
        value={{
          contract: null,
          accounts,
          signedInWith,
          jwtToken,
          setJwtToken,
          setAccounts,
          handleSignOut,
          handleSignedIn,
        }}
      >
        {children}
      </SubstrateContext.Provider>
    </SIWSProvider>
  );
};

export default Web3SubstrateProvider;
