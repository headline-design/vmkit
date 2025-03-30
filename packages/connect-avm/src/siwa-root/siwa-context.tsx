import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { SIWAConfig, SIWASession, SIWAStatusState } from "./utils";

export type SIWAContextValue = Required<SIWAConfig> & {
  nonce: ReturnType<typeof useQuery<string | null>>;
  session: ReturnType<typeof useQuery<SIWASession | null>>;
  status: SIWAStatusState;
  signIn: () => Promise<SIWASession | false>;
  resetStatus: () => void;
};

export const SIWAContext = createContext<SIWAContextValue | null>(null);
