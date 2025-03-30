"use client";

import { SiweMessage } from "siwe";
import { FC, PropsWithChildren, createContext } from "react";
import { createConfig, createStorage, WagmiProvider } from "wagmi";
import {
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit";
import { optimism, Chain } from "wagmi/chains";
import { http } from "wagmi";
import { useRouter } from "next/navigation";
import { cookieStorage } from "wagmi";
import { signIn } from "next-auth/react";
import { SIWEProvider } from "@vmkit/connect-evm";
import { SIWEConfig } from "@vmkit/connect-evm/server";

const APP_NAME = "VMkit";

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

declare let window: {
  ethereum?: EthereumProvider;
  location: Location;
  localStorage: Storage;
};

export type Web3ContextT = {
  contract: any | null;
};

export type NFTContractProviderProps = {
  children: React.ReactNode;
};

export const Web3Context = createContext<Web3ContextT>({} as Web3ContextT);

const config = createConfig(
  getDefaultConfig({
    appName: APP_NAME,
    ssr: true, // be sure to include this if you are using SSR
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [optimism as Chain],
    transports: {
      [optimism.id]: http(),
    },

    storage: createStorage({
      storage: cookieStorage,
    }),
  }),
);

const currentCallbackUrl = "/";

export const siweConfig: SIWEConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/auth/siwe`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWE nonce");

    return res.text();
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: "1",
      uri: typeof window !== "undefined" ? window.location.origin : "",
      domain: typeof window !== "undefined" ? window.location.host : "",
      statement: "Sign In With Ethereum to prove you control this wallet.",
    }).prepareMessage();
  },
  verifyMessage: async ({
    message,
    signature,
  }: {
    message: string | Uint8Array;
    signature: string;
  }) => {
    const res = await fetch(`/api/auth/siwe`, {
      method: "POST",
      body: JSON.stringify({
        message: JSON.stringify(message),
        signature,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch SIWE session");

    return await signIn("ethereum", {
      message: JSON.stringify(message),
      signature,
      redirect: false,
      callbackUrl: currentCallbackUrl,
    }).then((res) => res?.ok as boolean);
  },
  getSession: async () => {
    try {
      const res = await fetch(`/api/auth/siwe`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to fetch SIWE session");
      const { address, chainId } = data;

      return address && chainId ? { address, chainId } : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  signOut: () => fetch(`/api/auth/siwe`, { method: "DELETE" }).then((res) => res.ok),
};

export const Web3Contextual = (props: NFTContractProviderProps) => {
  const { children } = props;
  const contract = null;

  return (
    <Web3Context.Provider value={{ contract }}>{children}</Web3Context.Provider>
  );
};

export const Web3EVMProvider = ({ children }: { children: any }) => {
  return (
    <WagmiProvider config={config}>
      <Web3ChildProvider>{children}</Web3ChildProvider>
    </WagmiProvider>
  );
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

  return (
    <SIWEProvider
      onSignIn={() => router.refresh()}
      onSignOut={() => router.refresh()}
      {...siweConfig}
    >
      <ConnectKitProvider options={{ disableSiweRedirect: false }}>
        <Web3Contextual>{children}</Web3Contextual>
      </ConnectKitProvider>
    </SIWEProvider>
  );
};

export default Web3EVMProvider;
