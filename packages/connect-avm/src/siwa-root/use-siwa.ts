import { useContext } from 'react';
import { SIWAContext } from './siwa-context';
import { SIWASession, SIWAStatusState } from './utils';

type HookProps = {
  isSignedIn: boolean;
  data?: SIWASession;
  status: SIWAStatusState;
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

type UseSIWAConfig = {
  onSignIn?: (data?: SIWASession) => void;
  onSignOut?: () => void;
};

// Consumer-facing hook
export const useSIWA = ({ onSignIn, onSignOut }: UseSIWAConfig = {}): HookProps | any => {
  const siwaContextValue = useContext(SIWAContext);

  if (!siwaContextValue) {
    return {
      isSignedIn: false,
      data: undefined,
      status: SIWAStatusState.ERROR,
      error: new Error('useSIWA hook must be inside a SIWAProvider.'),
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

  const { session, nonce, status, signOut, signIn, resetStatus } = siwaContextValue;
  const { address, chainId } = session?.data || {};

  const currentStatus = address
    ? SIWAStatusState.SUCCESS
    : session?.isLoading || nonce?.isLoading
      ? SIWAStatusState.LOADING
      : status;

  const isLoading = currentStatus === SIWAStatusState.LOADING;
  const isSuccess = currentStatus === SIWAStatusState.SUCCESS;
  const isRejected = currentStatus === SIWAStatusState.REJECTED;
  const isError = currentStatus === SIWAStatusState.ERROR;
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
    error: session?.error || nonce?.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn: async () => {
      if (!isSignedIn) {
        const data = await signIn();
        if (data) onSignIn?.(data);
        return data !== false;
      }
      return false;
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
