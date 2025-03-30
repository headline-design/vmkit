import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

import { getSearchParams } from "@/lib/utils";
import { SiwaMessage } from "@avmkit/siwa";
import { SiweMessage } from "siwe";
import { Address, verifySIWS } from "@talismn/siws";
import { SiwsolMessage } from "@vmkit/connect-svm/server";
import { v4 as uuidv4 } from "uuid";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export interface Session {
  user: {
    email: string;
    id: string;
    name: string;
    nfd?: string;
    provider?: string;
    accessToken?: string;
    image?: string;
  };
}

export interface Profile {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  login?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "algorand",
      name: "Algorand",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        transaction: {
          label: "Transaction",
          type: "text",
          placeholder: "0x0",
        },
        domain: {
          label: "Domain",
          type: "text",
          placeholder: "example.com",
        },
        provider: {
          label: "Provider",
          type: "text",
          placeholder: "Algorand",
        },
        nfd: {
          label: "NFD",
          type: "text",
          placeholder: "HELLO_WORLD",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) {
            throw new Error("Credentials are undefined");
          }
          const siwa = new SiwaMessage(JSON.parse(credentials.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
          const validDomain =
            siwa.domain === nextAuthUrl.host ? nextAuthUrl.host : "";

          const verifyData: any = {
            signature: credentials.signature,
            encodedTransaction: credentials?.transaction || null,
            domain: validDomain,
            nonce: siwa.nonce,
          };

          if (
            credentials?.nfd &&
            credentials.nfd !== "null" &&
            credentials.nfd !== "undefined"
          ) {
            verifyData.nfd = credentials.nfd;
          }

          // VerifyParams
          const { data: fields, success } = await siwa.verify({
            ...verifyData,
          });

          if (fields && success) {
            const authResult = await handleWalletAuth(fields, "AVM");
            return authResult;
          }
        } catch (error) {
          console.error("Algorand auth error:", error);
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "ethereum",
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");
          const validDomain =
            siwe.domain === nextAuthUrl.host ? nextAuthUrl.host : "";

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: validDomain,
            nonce: siwe.nonce,
          });

          if (result.success) {
            return await handleWalletAuth(result.data, "EVM");
          }
        } catch (error) {
          console.error("Ethereum auth error:", error);
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "solana",
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("Credentials are undefined");
          }

          const payload = JSON.parse(credentials?.message);

          const siwsol = new SiwsolMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const result = await siwsol.verify({ payload });

          if (result.success) {
            return await handleWalletAuth(result.data, "SVM");
          }
        } catch (error) {
          console.error("Solana auth error:", error);
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "substrate",
      name: "Substrate",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        address: {
          label: "Address",
          type: "text",
          placeholder: "5...",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("Credentials are undefined");
          }

          const preAddress = credentials?.address || "";
          const baseAddress = Address.fromSs58(preAddress);

          if (!baseAddress) {
            console.error("Invalid address format");
            return null;
          }
          const address = baseAddress.toSs58(0);

          const message = JSON.parse(credentials?.message || "{}");
          const signature = credentials?.signature || "";
          const result = await verifySIWS(message, signature, address, {
            disableAzeroId: true,
          })
            .then((res) => {
              console.log("res", res);
              return res;
            })
            .catch((e) => {
              console.log("e", e);
              return e;
            });

          if (result && result.nonce) {
            return await handleWalletAuth(result, "Substrate");
          }
        } catch (error) {
          console.error("Substrate auth error:", error);
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "", verifyRequest: "", error: "" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT ? "vmkit.xyz" : "localhost",
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    async signIn({ user }) {
      return !!user.email;
    },
    async jwt({ token, user, account }) {
      if (!token.email) return {};

      if (account?.provider) {
        token.provider = account.provider;
      }

      if (user) token.user = user;

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub,
        vm: (token.vm as string) || "Unknown VM",
        ...(typeof token.user === "object" ? token.user : {}),
        // Add the provider information here
        provider: token.provider as string,
        wallets: (token.user as { wallets: any[] })?.wallets || [],
      };
      return session;
    },
  },
};

interface WithSessionHandler {
  ({
    req,
    params,
    searchParams,
    session,
  }: {
    req: Request;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    session: Session;
  }): Promise<Response>;
}

export const withSession =
  (handler: WithSessionHandler) =>
  async (req: Request, { params }: { params: Record<string, string> }) => {
    const session = await getSession();
    if (!session?.user.id) {
      return new Response("Unauthorized: Login required.", { status: 401 });
    }

    const searchParams = getSearchParams(req.url);
    return handler({ req, params, searchParams, session });
  };

export default NextAuth(authOptions);

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      vm: string;
      role: any;
      id: string;
      name: string;
      username: string;
      provider: string;
      email: string;
      image: string;
    };
  } | null>;
}

/**
 * Handles wallet authentication and extracts relevant blockchain info.
 * Returns a structured user object.
 */
async function handleWalletAuth(
  data: any,
  vm: "AVM" | "EVM" | "SVM" | "Substrate"
) {
  const address = data?.address;
  const session = await getSession();
  const emailProvider = vm.toLowerCase();
  let user: any;
  let wallet: any;

  // Check if user exists
  if (session?.user?.id) {
    user = {
      id: session.user.id,
      provider: session.user.provider || emailProvider,
      vm,
      name: address,
      email: `${address}@${emailProvider}.web3`,
    };
    wallet = {
      address,
      chainId: data.chainId,
      userId: user.id,
      status: "active",
      vm,
    };
  } else if (!session?.user?.id) {
    user = {
      id: data?.id || uuidv4(),
      provider: emailProvider,
      name: address,
      email: `${address}@${emailProvider}.web3`,
      vm,
    };
    wallet = {
      address,
      chainId: data.chainId,
      userId: user.id,
      status: "active",
      vm,
    };
  }

  const profile = {
    ...user,
    wallets: [wallet],
  };

  return profile;
}

export function withUserAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession();
    if (!session?.user.id) return res.status(401).end("Unauthorized");
    return handler(req, res, session);
  };
}

export async function getAuthToken(req: NextApiRequest) {
  return getToken({ req });
}

export function withPublic(handler: any) {
  return async (
    req: Request,
    { params }: { params: Record<string, string> }
  ) => {
    const searchParams = getSearchParams(req.url);
    return handler({ req, params, searchParams, headers: {} });
  };
}
