import { Button } from "@/components/ui/button";
import { useSIWE } from "@vmkit/connect-evm";
import { useModal } from "connectkit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Account } from "./shared/components";
import { SIWESession } from "@vmkit/connect-evm/server";
import FlatEth from "@/icons/flat-brands/flat-eth";

const ConnectRoot = () => {
  const { setOpen } = useModal();
  const { isConnected, isConnecting } = useAccount();
  const account = useAccount();

  const { disconnect, isPending } = useDisconnect();
  const { reset } = useConnect();

  const handleDisconnect = () => {
    disconnect();
    reset();
  };

  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } = useSIWE({
    onSignIn: (session?: SIWESession) => {
      // Do something with the data
    },
    onSignOut: () => {
      // Do something when signed out
    },
  });


  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWESession) => {
      // Do something when signed in
    });
  };

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      // Do something when signed out
    });
  };

  /** Wallet is connected and signed in */
  if (isSignedIn) {
    return (
      <>
        <div>Address: {data?.address}</div>
        <div>ChainId: {data?.chainId}</div>
        <button onClick={handleSignOut}>Sign Out</button>
      </>
    );
  }

  /** Wallet is connected, but not signed in */
  if (isConnected) {
    return (
      <>
        <div className="flex h-full flex-1 flex-col">
          <p className="text-lg text-foreground font-medium">Sign In</p>
          <p className="text-muted-foreground">
            EVM Client connected. Sign in with SIWE.
          </p>
          <div className="my-4 flex h-auto min-h-24 flex-col gap-3 overflow-y-auto rounded-lg border bg-background-tertiary  p-2">
            <Account
              key={account.address}
              account={account}
              selected={true}
            />
          </div>
          <div className="grid gap-3">
            <Button onClick={handleSignIn} disabled={isLoading} loading={isLoading} text={isRejected // User Rejected
              ? "Try Again"
              : isLoading // Waiting for signing request
                ? "Awaiting request..."
                : // Waiting for interaction
                "Sign In"} />
            <Button variant="outline" onClick={handleDisconnect} disabled={isPending || isLoading} text="Disconnect" />
          </div>
        </div>
      </>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <div className="flex flex-col">
        <p className="text-lg text-foreground font-medium">SIWE</p>
        <p className="mb-4 text-muted-foreground">
          Connect your EVM wallet to secure your session with Ethereum.
        </p>
        <Button fat onClick={() => setOpen(true)} disabled={isLoading} text={isLoading ? "Connecting wallet..." : "Connect Wallet"} />
      </div>
      <FlatEth className="opacity-30 mx-auto mt-[5%] items-center justify-center w-24 h-24" />
    </>
  );
};

export const SIWEConnect = () => {
  return (
    <div className="w-full">
      <div className="flex min-h-[384px] w-full flex-1 flex-col rounded-xl border p-4 sm:h-96">
        <ConnectRoot />
      </div>
    </div>
  );
}

export default SIWEConnect;