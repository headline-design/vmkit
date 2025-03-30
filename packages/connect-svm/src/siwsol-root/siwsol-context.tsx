import { createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SIWSolConfig, SIWSolSession, SIWSolStatusState } from './utils';


export type SIWSolContextValue = Required<SIWSolConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWSolSession | null>>;
  status: SIWSolStatusState;
  signIn: () => Promise<SIWSolSession | false>;
  resetStatus: () => void;
};

export const SIWSolContext = createContext<SIWSolContextValue | null>(null);
