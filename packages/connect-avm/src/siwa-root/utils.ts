export enum SIWAStatusState {
    READY = "ready",
    LOADING = "loading",
    SUCCESS = "success",
    REJECTED = "rejected",
    ERROR = "error",
  }

  export type SIWASession = {
    address: string;
    chainId: number;
  };

  export type SIWAConfig = {
    // Required
    getNonce: () => Promise<string>;
    createMessage: (args: {
      nonce: string;
      address: string;
      chainId: number;
    }) => string;
    verifyMessage: (args: {
      message: string | Uint8Array;
      signature: string;
      transaction: string;
      nfd?: string | undefined;
    }) => Promise<boolean>;
    getSession: () => Promise<SIWASession | null>;
    signOut: () => Promise<boolean>;

    // Optional, we have default values but they can be overridden
    enabled?: boolean;
    nonceRefetchInterval?: number;
    sessionRefetchInterval?: number;
    signOutOnDisconnect?: boolean;
    signOutOnAccountChange?: boolean;
    signOutOnNetworkChange?: boolean;
  };