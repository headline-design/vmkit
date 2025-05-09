import { useContext } from "react";
import { SIWEContext } from "./siwe-context";
import { SIWEStatusState, SIWESession } from "./utils";

type HookProps = {
  isSignedIn: boolean;
  data?: SIWESession;
  status: SIWEStatusState;
  error?: Error | any;
  isRejected: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isReady: boolean;

  reset: () => void;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
};

type UseSIWEConfig = {
  onSignIn?: (data?: SIWESession) => void;
  onSignOut?: () => void;
};

// Consumer-facing hook
export const useSIWE = ({ onSignIn, onSignOut }: UseSIWEConfig = {}):
  | HookProps
  | any => {
  const siweContextValue = useContext(SIWEContext);
  if (!siweContextValue) {
    // If we throw an error here then this will break non-SIWE apps, so best to just respond with not signed in.
    //throw new Error('useSIWE hook must be inside a SIWEProvider.');
    return {
      isSignedIn: false,
      data: undefined,
      status: SIWEStatusState.ERROR,
      error: new Error("useSIWE hook must be inside a SIWEProvider."),
      isRejected: false,
      isError: true,
      isLoading: false,
      isSuccess: false,
      isReady: false,
      reset: () => {},
      signIn: () => Promise.reject(),
      signOut: () => Promise.reject(),
    };
  }

  const { session, nonce, status, signOut, signIn, resetStatus } =
    siweContextValue;
  const { address, chainId } = session.data || {};

  const currentStatus = address
    ? SIWEStatusState.SUCCESS
    : session.isLoading || nonce.isLoading
    ? SIWEStatusState.LOADING
    : status;

  const isLoading = currentStatus === SIWEStatusState.LOADING;
  const isSuccess = currentStatus === SIWEStatusState.SUCCESS;
  const isRejected = currentStatus === SIWEStatusState.REJECTED;
  const isError = currentStatus === SIWEStatusState.ERROR;
  const isReady = !address || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  const isSignedIn = !!address;

  return {
    isSignedIn,
    data: isSignedIn
      ? {
          address: address as string,
          chainId: chainId as number,
        }
      : undefined,
    status: currentStatus,
    error: session.error || nonce.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn: async () => {
      if (!isSignedIn) {
        const data = await signIn();
        if (data) onSignIn?.(data);
      }
    },
    signOut: async () => {
      if (isSignedIn) {
        await signOut();
        onSignOut?.();
      }
    },
    reset,
  };
};
