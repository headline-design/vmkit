import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SIWEConfig, SIWESession, SIWEStatusState } from './utils';


export type SIWEContextValue = Required<SIWEConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWESession | null>>;
  status: SIWEStatusState;
  signIn: () => Promise<SIWESession | false>;
  resetStatus: () => void;
};

export const SIWEContext = createContext<SIWEContextValue | null>(null);
