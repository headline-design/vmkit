"use client";

import type React from "react"
import { Button, toast } from "@/components/ui"
import { Copy } from "lucide-react"
import { Account } from "../shared/components";
import { useSIWSol } from  "@vmkit/connect-svm";
import { SIWSolSession } from "@vmkit/connect-svm/server";
import { FlatSol } from "@/icons/flat-brands";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletMultiButton } from "./wallet-multi-button";


type WalletConnectProps = {
  labels?: {
    "no-wallet": string
    "has-wallet": string
    connecting: string
    "copy-address": string
    copied: string
    "change-wallet": string
    disconnect: string
    "sign-in": string
    "sign-out": string
    "try-again": string
  }
}

const defaultLabels = {
  "no-wallet": "Connect Wallet",
  "has-wallet": "Connect",
  connecting: "Connecting...",
  "copy-address": "Copy Address",
  copied: "Copied!",
  "change-wallet": "Change Wallet",
  disconnect: "Disconnect",
  "sign-in": "Sign In",
  "sign-out": "Sign Out",
  "try-again": "Try Again",
}

export const SiwsolConnect: React.FC<WalletConnectProps> = ({ labels = defaultLabels }) => {
  const { setVisible: setModalVisible } = useWalletModal()
  const { buttonState, onConnect, onDisconnect, publicKey, walletIcon, walletName } = useWalletMultiButton({
    onSelectWallet() {
      setModalVisible(true)
    },
  })

 const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } = useSIWSol({
    onSignIn: (session?: SIWSolSession) => {
      // Do something with the data
    },
    onSignOut: () => {
      // Do something when signed out
    },
  });


  const handleSignIn = async () => {
    await signIn()?.then((session?: SIWSolSession) => {
      // Do something when signed in
    });
  };

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      // Do something when signed out
    });
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect()
    }
  }

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58())
      toast({
        title: labels["copied"],
        description: "The address has been copied to your clipboard",
      })
    }
  }

  // Create an account object from the wallet data
  const walletAccount = publicKey
    ? {
      address: publicKey.toBase58(),
      meta: { name: walletName || "Solana Wallet" },
    }
    : null

  /** Wallet is connected and signed in */
  if (buttonState === "connected" && isSignedIn) {
    return (
      <div className="flex h-full flex-1 flex-col">
        <p className="text-lg text-foreground font-medium">Connected Wallet</p>
        <p className="text-muted-foreground">Your Solana wallet is connected and signed in.</p>

        <div className="my-4 flex h-auto min-h-24 flex-col gap-3 overflow-y-auto rounded-lg border bg-background-tertiary p-2">
          {walletAccount && <Account account={walletAccount} selected={true} />}
        </div>

        <div className="grid gap-3">
          <Button
            variant="outline"
            onClick={handleCopyAddress}
            text={labels["copy-address"]}
            icon={<Copy className="h-4 w-4" />}
          />

          <Button variant="outline" onClick={() => setModalVisible(true)} text={labels["change-wallet"]} />

          <Button onClick={handleSignOut} disabled={isLoading} loading={isLoading} text={labels["sign-out"]} />

          <Button variant="outline" onClick={handleDisconnect} text={labels["disconnect"]} />
        </div>
      </div>
    )
  }

  /** Wallet is connected, but not signed in */
  if (buttonState === "connected") {
    return (
      <div className="flex h-full flex-1 flex-col">
        <p className="text-lg text-foreground font-medium">Sign In</p>
        <p className="text-muted-foreground">Solana wallet connected. Sign in to continue.</p>

        <div className="my-4 flex h-auto min-h-24 flex-col gap-3 overflow-y-auto rounded-lg border bg-background-tertiary p-2">
          {walletAccount && <Account account={walletAccount} selected={true} />}
        </div>

        <div className="grid gap-3">
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            loading={isLoading}
            text={isRejected ? labels["try-again"] : isLoading ? "Awaiting request..." : labels["sign-in"]}
          />

          <Button variant="outline" onClick={handleDisconnect} disabled={isLoading} text={labels["disconnect"]} />
        </div>
      </div>
    )
  }

  /** A wallet needs to be connected first */
  return (
    <div className="flex flex-col">
      <p className="text-lg text-foreground font-medium">Solana Wallet</p>
      <p className="mb-4 text-muted-foreground">Connect your Solana wallet to secure your session.</p>

      <Button
        fat
        onClick={() => {
          switch (buttonState) {
            case "no-wallet":
              setModalVisible(true)
              break
            case "has-wallet":
              if (onConnect) {
                onConnect()
              }
              break
          }
        }}
        disabled={buttonState === "connecting" || isLoading}
        loading={buttonState === "connecting" || isLoading}
        text={
          buttonState === "connecting"
            ? labels["connecting"]
            : buttonState === "has-wallet"
              ? labels["has-wallet"]
              : labels["no-wallet"]
        }
      />

      <FlatSol className="opacity-30 mx-auto mt-[5%] items-center justify-center w-24 h-24" />
    </div>
  )
}

export default SiwsolConnect

