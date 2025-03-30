"use client";

import {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SIWSolProvider } from "@vmkit/connect-svm";
import React, { useCallback, useEffect, useMemo } from "react";
import "@/styles/wallet-adapter-solana.css";
import { SIWSolConfig, SiwsolMessage } from "@vmkit/connect-svm/server";
import { getCurrentCallbackUrl } from "@/lib/client-utils";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { useLocalStorage } from "@solana/wallet-adapter-react";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import type { Adapter } from "@solana/wallet-adapter-base";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";

export interface SIWSOLCreateMessageArgs {
  nonce: string;
  address: string;
  chainId: number;
}

declare let window: {
  solana?: SolanaProvider;
  location: Location;
  localStorage: Storage;
};

export interface SolanaProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

export type Web3ContextT = {
  contract: any | null;
};

export type NFTContractProviderProps = {
  children: React.ReactNode;
};

interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState,
);

export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useLocalStorage("autoConnect", true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
};

export const Web3Context = createContext<Web3ContextT>({} as Web3ContextT);

export const getDefaultConfig = (config: any) => {
  return {
    setState: () => { },
    connect: () => { },
    appName: "VMkit",
    appIcon: "/favicon.svg",
    appDescription: "VMkit Connect is a Solana auth provider.",
    appUrl: typeof window !== "undefined" ? window.location.origin : "",
    walletConnectProjectId: "",
    chains: [],
    client: null,
    ...config,
  };
};

const currentCallbackUrl = getCurrentCallbackUrl();

export const siwsolConfig: SIWSolConfig = {
  getNonce: async () => {
    const res = await fetch(`/api/auth/siwsol`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to fetch SIWSol nonce");
    return res.text();
  },

  createMessage: async ({
    address,
    chainId,
    nonce,
  }): Promise<SolanaSignInInput> => {
    const now: Date = new Date();
    const uri = window.location.href;
    const currentUrl = new URL(uri);
    const domain = currentUrl.host;

    // Convert the Date object to a string
    const currentDateTime = now.toISOString();
    const signInData: SolanaSignInInput = {
      domain,
      statement:
        "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
      version: "1",
      nonce,
      address,
      chainId,
      issuedAt: currentDateTime,
      resources: ["https://example.com", "https://phantom.app/"],
    };

    return signInData;
  },
  verifyMessage: async ({ payload }: { payload: any }) => {
    const res = await fetch(`/api/auth/siwsol`, {
      method: "POST",
      body: JSON.stringify({ payload }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch SIWSOL session");

    return await signIn("solana", {
      message: JSON.stringify(payload),
      redirect: false,
      callbackUrl: currentCallbackUrl ?? undefined,
    }).then((res) => res?.ok as boolean);
  },
  getSession: async () => {
    try {
      const res = await fetch(`/api/auth/siwsol`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to fetch SIWSol session");
      const { address, chainId } = data;

      return address && chainId ? { address, chainId } : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  signOut: () =>
    fetch(`/api/auth/siwsol`, { method: "DELETE" }).then((res) => res.ok),
};

export const Web3Contextual = (props: NFTContractProviderProps) => {
  const { children } = props;
  const contract = null;

  return (
    <Web3Context.Provider value={{ contract }}>{children}</Web3Context.Provider>
  );
};

export const Web3SVMProvider = ({ children }: { children: any }) => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = `https://shape-mainnet.g.alchemy.com/v2/-SX2R3J_B5SoH85EcD1Xn2t8itx81IcZ`;

  const wallets = useMemo(
    () => [], // confirmed also with `() => []` for wallet-standard only
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    if (!("signIn" in adapter)) return true;

    // Fetch the signInInput from the backend
    const input: SolanaSignInInput = await SiwsolMessage.createSignInData();

    try {
      // Send the signInInput to the wallet and trigger a sign-in request
      const output = await adapter.signIn(input);
      const constructPayload = JSON.stringify({ input, output });

      // Verify the sign-in output against the generated input server-side
      const deconstructPayload: {
        input: SolanaSignInInput;
        output: SolanaSignInOutput;
      } = JSON.parse(constructPayload);

      const backendInput = deconstructPayload.input;
      const backendOutput: SolanaSignInOutput = {
        account: {
          //@ts-ignore

          publicKey: new Uint8Array(output.account.publicKey),
          ...output.account,
        },
        signature: new Uint8Array(output.signature),
        signedMessage: new Uint8Array(output.signedMessage),
      };

      if (!verifySignIn(backendInput, backendOutput)) {
        console.error("Sign In verification failed!");
        throw new Error("Sign In verification failed!");
      }
    } catch (error) {
      // Handle user rejection or other errors
      console.warn("User rejected the connection or an error occurred:", error);
      return false; // Or handle as appropriate for your application
    }

    return false;
  }, []);

  const autoConnect = useCallback(
    async (adapter: Adapter) => {
      adapter.autoConnect().catch((e) => {
        return autoSignIn(adapter);
      });
      return false;
    },
    [autoSignIn],
  );
  return (
    <AutoConnectProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={autoConnect}>
          <WalletModalProvider>
            <Web3ChildProvider>{children}</Web3ChildProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </AutoConnectProvider>
  );
};

const Web3ChildProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

  return (
    <SIWSolProvider
      onSignIn={() => router.refresh()}
      onSignOut={() => router.refresh()}
      {...siwsolConfig}
    >
      <Web3Contextual>{children}</Web3Contextual>
    </SIWSolProvider>
  );
};

export default Web3SVMProvider;