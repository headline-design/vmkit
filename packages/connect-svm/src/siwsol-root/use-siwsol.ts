import { useContext } from "react";
import { SIWSolContext } from "./siwsol-context";
import { SIWSolSession, SIWSolStatusState } from "./utils";

type HookProps = {
  isSignedIn: boolean;
  data?: SIWSolSession;
  status: SIWSolStatusState;
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

type UseSIWSolConfig = {
  onSignIn?: (data?: SIWSolSession) => void;
  onSignOut?: () => void;
};

// Consumer-facing hook
export const useSIWSol = ({ onSignIn, onSignOut }: UseSIWSolConfig = {}):
  | HookProps
  | any => {
  const siwsolContextValue = useContext(SIWSolContext);
  if (!siwsolContextValue) {
    // If we throw an error here then this will break non-SIWSol apps, so best to just respond with not signed in.
    //throw new Error('useSIWSol hook must be inside a SIWSolProvider.');
    return {
      isSignedIn: false,
      data: undefined,
      status: SIWSolStatusState.ERROR,
      error: new Error("useSIWSol hook must be inside a SIWSolProvider."),
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
    siwsolContextValue;
  const { address, chainId } = session.data || {};

  const currentStatus = address
    ? SIWSolStatusState.SUCCESS
    : session.isLoading || nonce.isLoading
    ? SIWSolStatusState.LOADING
    : status;

  const isLoading = currentStatus === SIWSolStatusState.LOADING;
  const isSuccess = currentStatus === SIWSolStatusState.SUCCESS;
  const isRejected = currentStatus === SIWSolStatusState.REJECTED;
  const isError = currentStatus === SIWSolStatusState.ERROR;
  const isReady = !address || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  const isSignedIn = !!address;

  return {
    isSignedIn,
    data: isSignedIn
      ? {
          address: address as string,
          chainId: chainId,
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
