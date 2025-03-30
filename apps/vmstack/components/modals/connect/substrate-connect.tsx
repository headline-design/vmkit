
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useSIWS } from  "@vmkit/connect-substrate";
import { FlatTalisman } from "@/icons/flat-brands";
import { Account, Profile } from "./shared/components";
import { useSubstrate } from "@/providers/web3/substrate-provider";

type Props = {
  onAccounts: (accounts: InjectedAccountWithMeta[]) => void;
};

type SignInProps = {
  accounts: InjectedAccountWithMeta[];
  onCancel: () => void;
  onSignedIn: (account: InjectedAccountWithMeta, jwtToken: string) => void;
};

type AccountProps = {
  account: InjectedAccountWithMeta;
  token: string;
  onSignOut: () => void;
};

type AccountishProps = {
  onSelect: () => void
  account: InjectedAccountWithMeta
  selected: boolean
}

export const SignIn: React.FC<SignInProps> = ({ onCancel, onSignedIn }) => {
  const { signIn: signInWithSIWS, isLoading } = useSIWS();
  const { accounts } = useSubstrate();

  // auto select if only 1 account is connected
  const [selectedAccount, setSelectedAccount] = useState<
    InjectedAccountWithMeta | undefined
  >(accounts?.length === 1 ? accounts[0] : undefined);

  return (
    <div className="flex h-full flex-1 flex-col">
      <p className="text-lg text-foreground font-medium">Sign In</p>
      <p className="text-muted-foreground">
        Select an account to sign in with.
      </p>
      <div className="my-4 flex h-auto min-h-[70px] flex-col gap-3 overflow-y-auto rounded-lg border bg-background-tertiary  p-2">
        {accounts?.length ?? 0 > 0 ? (
          <>
            {accounts?.map((account) => (
              <Account
                key={account.address}
                account={account}
                selected={selectedAccount?.address === account.address}
                onSelect={() => {
                  console.log('selecting this account', account);
                  setSelectedAccount(account);
                }}
              />
            ))}
            <p className="mt-2 text-center text-muted-foreground text-xs">
              Talisman wallets available
            </p>
          </>
        ) : (
          <p className="mt-4 text-center text-muted-foreground">
            No account connected.
            <br />
            Connect at least 1 account to sign in with.
          </p>
        )}
      </div>
      <div className="grid gap-3">
        <Button
          disabled={!selectedAccount || isLoading}
          onClick={() => signInWithSIWS()}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export const ConnectWallet: React.FC<Props> = ({ onAccounts }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setConnecting(true);
    const { web3Enable, web3Accounts } = await import(
      "@polkadot/extension-dapp"
    );
    try {
      const extensions = await web3Enable("Sign-In with Substrate Demo");

      if (extensions.length === 0) {
        onAccounts([]);
      } else {
        const accounts = await web3Accounts();
        console.log("accounts", accounts);
        onAccounts(accounts);
      }
    } catch (e) {
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <p className="text-lg text-foreground font-medium">SIWS</p>
        <p className="mb-4 text-muted-foreground">
          Connect your Talisman wallet to secure your session with Substrate.
        </p>
        <Button fat onClick={handleConnectWallet} disabled={connecting} text={connecting ? "Connecting wallet..." : "Connect Wallet"} />
      </div>
      <FlatTalisman className="opacity-30 mx-auto mt-[5%] items-center justify-center w-24 h-24" />
    </>
  );
};

export const SubstrateConnect = () => {
  const { signedInWith, accounts, setAccounts, handleSignOut, handleSignedIn } =
    useSubstrate();

  console.log('accounts', accounts);

  const { data: session } = useSession() as any;

  return (
    <div className="w-full">
      <div className="flex min-h-[384px] w-full flex-1 flex-col rounded-xl border p-4 sm:h-96">
        {signedInWith && !!session ? (
          <Profile
            account={signedInWith}
            token={((session?.user?.id as string) || null) as any}
            onSignOut={handleSignOut}
          />
        ) : accounts ? (
          <SignIn
            accounts={accounts}
            onCancel={() => setAccounts(undefined)}
            onSignedIn={handleSignedIn}
          />
        ) : (
          <ConnectWallet onAccounts={setAccounts} />
        )}
      </div>
    </div>
  );
};
