import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi';
import { getAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';
import {
  SIWEContext,
} from './siwe-context';
import { SIWEConfig, SIWESession, SIWEStatusState } from './utils';

type Props = SIWEConfig & {
  children: ReactNode;
  onSignIn?: (data?: SIWESession) => void;
  onSignOut?: () => void;
};

export const SIWEProvider = ({
  children,
  enabled = true,
  nonceRefetchInterval = 1000 * 60 * 5,
  sessionRefetchInterval = 1000 * 60 * 5,
  signOutOnDisconnect = true,
  signOutOnAccountChange = true,
  signOutOnNetworkChange = true,
  onSignIn,
  onSignOut,
  ...siweConfig
}: Props) => {
  const [status, setStatus] = useState<SIWEStatusState>(SIWEStatusState.READY);
  const resetStatus = () => setStatus(SIWEStatusState.READY);

  // Only allow for mounting SIWEProvider once, so we avoid weird global state
  // collisions.
  if (useContext(SIWEContext)) {
    throw new Error(
      'Multiple, nested usages of SIWEProvider detected. Please use only one.'
    );
  }

  const nonce = useQuery({
    queryKey: ['ckSiweNonce'],
    queryFn: () => siweConfig.getNonce(),
    enabled: false, // Prevent automatic fetching
  });

  const session = useQuery({
    queryKey: ['ckSiweSession'],
    queryFn: () => siweConfig.getSession(),
    enabled: false,
  });

  const sessionData = session.data;

  const signOutAndRefetch = async () => {
    if (!sessionData) return false; // No session to sign out of
    setStatus(SIWEStatusState.LOADING);
    if (!(await siweConfig.signOut())) {
      throw new Error('Failed to sign out.');
    }
    await Promise.all([session.refetch(), nonce.refetch()]);
    setStatus(SIWEStatusState.READY);
    onSignOut?.();
    return true;
  };

  const { address: connectedAddress } = useAccount();
  useAccountEffect({
    onDisconnect: () => {
      if (signOutOnDisconnect) {
        // For security reasons we sign out the user when a wallet disconnects.
        signOutAndRefetch();
      }
    },
  });

  const { address, chain } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const onError = (error: any) => {
    console.error('signIn error', error.code, error.message);
    switch (error.code) {
      case -32000: // WalletConnect: user rejected
      case 4001: // MetaMask: user rejected
      case 'ACTION_REJECTED': // MetaMask: user rejected
        setStatus(SIWEStatusState.REJECTED);
        break;
      default:
        setStatus(SIWEStatusState.ERROR);
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
    try {
      if (!siweConfig) throw new Error('SIWE not configured');

      let nonceValue = await fetchNonce();

      if (!nonceValue) {
        for (let attempt = 0; attempt < 2; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay between retries
          nonceValue = await fetchNonce();
          if (nonceValue) break; // Stop retrying if nonce is fetched
        }
      }

      if (!nonceValue) {
        throw new Error("Could not fetch nonce");
      }

      const chainId = chain?.id;
      if (!address) throw new Error('No address found');
      if (!chainId) throw new Error('No chainId found');

      setStatus(SIWEStatusState.LOADING);

      const message = siweConfig.createMessage({
        address,
        chainId,
        nonce: nonceValue,
      });

      const signature = await signMessageAsync({
        message,
        account: address,
      });

      if (!(await siweConfig.verifyMessage({ message, signature }))) {
        throw new Error('Error verifying SIWE signature');
      }

      const data = await session.refetch().then((res) => {
        onSignIn?.(res?.data ?? undefined);
        return res?.data;
      });

      setStatus(SIWEStatusState.READY);
      return data as SIWESession;
    } catch (error) {
      onError(error);
      return false;
    }
  };


  useEffect(() => {
    // Skip if we're still fetching session state from backend
    if (!sessionData || !sessionData.address || !sessionData.chainId) return;
    // Skip if wallet isn't connected (i.e. initial page load)
    if (!connectedAddress || !chain) return;

    // If SIWE session no longer matches connected account, sign out
    if (
      signOutOnAccountChange &&
      getAddress(sessionData.address) !== getAddress(connectedAddress)
    ) {
      console.warn('Wallet account changed, signing out of SIWE session');
      signOutAndRefetch();
    }
    // The SIWE spec includes a chainId parameter for contract-based accounts,
    // so we're being extra cautious about keeping the SIWE session and the
    // connected account/network in sync. But this can be disabled when
    // configuring the SIWEProvider.
    else if (signOutOnNetworkChange && sessionData.chainId !== chain.id) {
      console.warn('Wallet network changed, signing out of SIWE session');
      signOutAndRefetch();
    }
  }, [sessionData, connectedAddress, chain]);

  return (
    <SIWEContext.Provider
      value={{
        enabled,
        nonceRefetchInterval,
        sessionRefetchInterval,
        signOutOnDisconnect,
        signOutOnAccountChange,
        signOutOnNetworkChange,
        ...siweConfig,
        nonce,
        session,
        signIn,
        signOut: signOutAndRefetch,
        status,
        resetStatus,
      }}
    >
      {children}
    </SIWEContext.Provider>
  );
};
