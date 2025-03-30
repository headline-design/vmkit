"use client";

import { useState, useContext, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, ChevronRight, ExternalLink, Shield, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { IconEthereum } from "../../icons/brand-icons";
import { GlobalModalContext } from "@/providers/global-modal-provider";
import { useLogout } from "@/lib/hooks/use-logout";
import { Button } from "../ui";
import VeryFlatAlgo from "@/icons/flat-brands/flat-algo-v2";
import { cn, shorten } from "@/lib/utils";
import { ChainSolana } from "@/icons/chains";
import { FlatSol, FlatPolkadot, FlatAlgo, FlatPera, FlatTalisman, FlatEthereum, FlatMetamask, FlatPhantom } from "@/icons/flat-brands";
import FlatDot from "@/icons/flat-brands/flat-dot";
import ConnectDetails from "./connect-details";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import Badge from "../ui/badge/badge";
import { Separator } from "../ui/separator";
import { Loader2 } from "../ui/loader/loader";

type AuthMethod = "AVM" | "Substrate" | "EVM" | "SVM";

const authThemes = {
    AVM: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#999999",
    },
    Substrate: {
        primary: "#E6007A",
        secondary: "#FF80AB",
        accent: "#FFC1E3",
    },
    EVM: {
        primary: "#627EEA",
        secondary: "#8C8C8C",
        accent: "#B3B3B3",
    },
    SVM: {
        primary: "#14F195",
        secondary: "#9945FF",
        accent: "#C299FF",
    },
};

export default function ConnectSection() {

    const { setShowLoginModal, setAuthFlow } = useContext(GlobalModalContext);
    const { data: session, status } = useSession();
    const { handleDisconnect, signingOut } = useLogout();

    const [error, setError] = useState<string | null>(null);
    const { theme, setTheme } = useTheme();
    const [authMethod, setAuthMethod] = useState<AuthMethod>(
        // If authenticated, use the provider from session, otherwise default to "AVM"
        session?.user ? (getProviderDetails(session.user.provider).label as AuthMethod) : "AVM",
    )
    useEffect(() => {
        const root = document.documentElement;
        const currentTheme = authThemes[authMethod];
        Object.entries(currentTheme).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
            root.style.setProperty(
                `--color-${key}-dark`,
                adjustColorForDarkMode(value),
            );
        });
    }, [authMethod, theme]);

    const details = useMemo(() => getAuthMethodDetails(authMethod), [authMethod]);

    const handleConnect = async () => {
        setError(null);
        try {
            setShowLoginModal(true);
            setAuthFlow({
                type: "login",
                vm: authMethod,
            })
        } catch (err) {
            setError("Failed to connect. Please try again.");
        }
    };

    useEffect(() => {
        if (session?.user) {
            const provider = getProviderDetails(session.user.provider).label as AuthMethod;
            setAuthMethod(provider);
        }
    }, [session]);

    const provider = useMemo(() => getProviderDetails(session?.user?.provider || "AVM"), [session]);
    const providerColor = authThemes[provider.label as AuthMethod]?.primary || "#000000";

    const onDisconnect = async () => {
        setError(null);
        try {
            await handleDisconnect()
        } catch (err) {
            setError("Failed to disconnect. Please try again.");
        }
    }

    return (
        <section

            className="w-full bg-background-accent p-4 transition-colors duration-300 md:p-12"
        >
            <div className="mx-auto max-w-[1300px]">
                <Card className="overflow-hidden  shadow-sm transition-all duration-300 ease-in-out ">
                    <Tabs
                        value={authMethod}
                        className="w-full"
                        onValueChange={(value) => setAuthMethod(value as AuthMethod)}
                    >
                        <TabsList className="grid w-full grid-cols-4 rounded-b-none bg-muted p-1">

                            {Object.keys(authThemes).map((method) => (
                                <TabsTrigger
                                    key={method}
                                    value={method}
                                    disabled={status === "loading" || status === "authenticated"}
                                    className={cn("data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground")}
                                >
                                    {method}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="grid md:grid-cols-2">
                            <CardContent className="p-6 md:p-8">
                                {session ? (
                                    <div className={cn("flex flex-col h-full w-full")}>
                                        <div className="flex items-center mb-6">
                                            <Badge variant="success" className=" flex items-center gap-1.5 px-2.5 py-1">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                <span>Connected</span>
                                            </Badge>
                                        </div>

                                        <Card className="p-6 border border-muted/80 shadow-sm bg-background/50 relative overflow-hidden">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-background to-muted/30 blur-sm -m-1" />
                                                    <div className="relative">
                                                        <ProviderIcon size="large" provider={session.user.provider} />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold tracking-tight text-foreground" >
                                                        {provider.chain}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm">
                                                        Securely connected to your account
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator className="my-5" />

                                            <div className="space-y-4">
                                                {session.user.name && (
                                                    <div className="flex items-center gap-3">
                                                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">{shorten(session.user.name)}</p>
                                                            <p className="text-xs text-muted-foreground">Account Name</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {session.user.email && (
                                                    <div className="flex items-center gap-3">
                                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm font-medium">{shorten(session.user.email)}</p>
                                                            <p className="text-xs text-muted-foreground">Email Id</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex flex-col gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-between"
                                                    onClick={() => window.open(provider.website || '#', '_blank')}
                                                >
                                                    Visit {provider.chain}
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="secondary"
                                                    className="w-full"
                                                    onClick={onDisconnect}
                                                    disabled={signingOut}
                                                >
                                                    {signingOut ? "Disconnecting..." : "Disconnect"}
                                                </Button>
                                            </div>
                                        </Card>

                                        <div className="mt-6 text-center">
                                            <p className="text-xs text-muted-foreground">
                                                Connected on {new Date(session.expires).toLocaleDateString()}
                                                {session.expires && ` · Expires ${new Date(session.expires).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <TabsContent value={authMethod}>
                                        <AuthMethodContent
                                            method={authMethod}
                                            onConnect={handleConnect}
                                            onDisconnect={handleDisconnect}
                                            session={session}
                                            error={error}
                                        />
                                    </TabsContent>
                                )}
                            </CardContent>
                            <CardContent className="border-t bg-muted/5 p-6 transition-colors duration-300 ease-in-out dark:bg-muted/10 md:border-l md:border-t-0 md:p-8">
                                <AuthStatusContent
                                    status={status}
                                    session={session}
                                    details={details}
                                    onDisconnect={handleDisconnect}
                                />
                            </CardContent>
                        </div>
                    </Tabs>
                </Card>
            </div>
        </section>
    );
}

function AuthMethodContent({
    method,
    onConnect,
    onDisconnect,
    session,
    error,
}: {
    method: AuthMethod;
    onConnect: () => void;
    onDisconnect: () => void;
    session: any;
    error: string | null;
}) {
    const details = useMemo(() => getAuthMethodDetails(method), [method]);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="rounded-full bg-muted p-2">{details.icon}</div>
                <div>
                    <CardTitle className="text-foreground leading-normal">{details.title}</CardTitle>
                    <CardDescription>{details.description}</CardDescription>
                </div>
            </div>
            <div className="space-y-4">
                {!session && (
                    <Button
                        onClick={onConnect}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        aria-label="Connect wallet"
                    >
                        <span className="flex items-center justify-center gap-2">
                            Connect Wallet
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    </Button>
                )}
                {error && (
                    <div className="flex items-center text-destructive">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">{details.walletSupport}</p>
        </div>
    );
}

function AuthStatusContent({ status, session, details, onDisconnect }) {
    if (status === "loading") {
        return <LoadingState />;
    }
    if (session) {
        return <ConnectDetails user={session?.user} strategy="local" />;
    }
    return <NotConnectedState details={details} />;
}

function ProviderIcon({ provider, size }: { provider: string; size?: any }) {
    const details = getProviderDetails(provider);
    return (
        <div className={cn(
            "flex items-center justify-center overflow-hidden bg-transparent opacity-80",
            size === "large" ? "h-20 w-20" : "h-5 w-5",
        )}>
            {details.icon}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-muted-foreground" />
            <span className="mt-4 text-base font-medium text-muted-foreground">
                Loading...
            </span>
        </div>
    );
}

function NotConnectedState({
    details,
}: {
    details: ReturnType<typeof getAuthMethodDetails>;
}) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            {details.iconLarge}
            <span className="mt-4 text-base text-muted-foreground">
                Connect your {details.wallet} to see your{" "}
                {details.title.split(" ").pop()} details.
            </span>
        </div>
    );
}

function getProviderDetails(provider: string) {
    const providers = {
        ethereum: {
            label: "EVM",
            chain: "Ethereum",
            icon: <IconEthereum className="h-full w-full" />,
            website: "https://ethereum.org",
        },
        algorand: { label: "AVM", chain: "Algorand", website: "https://algorand.org", icon: <VeryFlatAlgo className="h-full w-full" /> },
        solana: { label: "SVM", website: "https://solana.com", chain: "Solana", icon: <FlatSol className="h-full w-full" color="var(--color-primary)" /> },
        substrate: {
            label: "Substrate",
            chain: "Polkadot",
            website: "https://polkadot.com",
            icon: <FlatPolkadot className="h-full w-full " />,
        },
    };
    return providers[provider] || providers.algorand;
}

function getAuthMethodDetails(method: AuthMethod) {
    const details = {
        AVM: {
            title: "Sign In with Algorand",
            description: "Connect your Algorand wallet to start the auth process.",
            wallet: "Pera Wallet",
            walletSupport:
                "SIWA currently supports Kibisis, Pera, and X Wallet with more wallet support coming soon",
            icon: (
                <FlatAlgo
                    className="h-8 w-8 flex-shrink-0"
                    bgClassName="fill-foreground"
                    fgClassName="fill-background"
                />
            ),
            iconLarge: <FlatPera className="h-16 w-16 text-muted-foreground" />,
        },
        Substrate: {
            title: "Sign In with Substrate",
            description: "Connect your Substrate wallet to start the auth process.",
            wallet: "Talisman Wallet",
            walletSupport:
                "SIWS currently supports Talisman Wallet with more wallet support coming soon",
            icon: <FlatDot className="h-8 w-8 flex-shrink-0 text-foreground" />,
            iconLarge: <FlatTalisman className="h-16 w-16 text-muted-foreground" />,
        },
        EVM: {
            title: "Sign In with Ethereum",
            description: "Connect your Ethereum wallet to start the auth process.",
            wallet: "MetaMask Wallet",
            walletSupport:
                "SIWE supports MetaMask, WalletConnect, and other popular Ethereum wallets",
            icon: <FlatEthereum className="h-8 w-8 flex-shrink-0" />,
            iconLarge: <FlatMetamask className="h-16 w-16 text-muted-foreground" />,
        },
        SVM: {
            title: "Sign In with Solana",
            description: "Connect your Solana wallet to start the auth process.",
            wallet: "Phantom Wallet",
            walletSupport:
                "SIWSOL supports Phantom Wallet and OKX Wallet with more wallet support coming soon",
            icon: <ChainSolana className="h-8 w-8 flex-shrink-0" />,
            iconLarge: <FlatPhantom className="h-16 w-16 text-muted-foreground" />,
        },
    };
    return details[method];
}

function adjustColorForDarkMode(color: string): string {
    const rgb = color.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [];
    return `#${rgb
        .map((x) =>
            Math.min(255, Math.round(x * 0.8))
                .toString(16)
                .padStart(2, "0"),
        )
        .join("")}`;
}
