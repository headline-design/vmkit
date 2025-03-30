import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";

export interface ExtendedSolanaSignInInput {
  data: SolanaSignInInput;
  success: boolean;
}

export class SiwsolMessage {
  domain: string | undefined;
  statement: string;
  address: string; // Ensure address is included
  private version: string;
  nonce: string;
  chainId: string;
  private issuedAt: string;
  private resources: readonly string[];
  uri: string;

  constructor({
    domain,
    statement,
    version,
    nonce,
    chainId,
    address, // Add address here
    issuedAt,
    resources,
    uri,
  }: SolanaSignInInput) {
    this.domain = domain || '';
    this.statement = statement || '';
    this.version = version || '1';
    this.nonce = nonce || 'unique-nonce-here';
    this.chainId = chainId || 'mainnet';
    this.address = address || 'solana-address-here'; // Initialize address
    this.issuedAt = issuedAt || new Date().toISOString();
    this.resources = resources || [];
    this.uri = uri || '';
  }

  public prepareMessage(): SolanaSignInInput {
    return {
      domain: this.domain,
      statement: this.statement,
      version: this.version,
      nonce: this.nonce,
      chainId: this.chainId,
      issuedAt: this.issuedAt,
      resources: this.resources,
    };
  }

  public static async createSignInData(): Promise<SolanaSignInInput> {
    const now = new Date();
    const currentDateTime = now.toISOString();
    const uri = typeof window !== "undefined" ? window.location.origin : "";
    const domain = typeof window !== "undefined" ? window.location.host : "";

    return new SiwsolMessage({
      domain,
      statement:
        "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
      version: "1",
      nonce: "unique-nonce-here",
      chainId: "mainnet",
      issuedAt: currentDateTime,
      resources: ["https://example.com", "https://phantom.app/"],
      uri,
    }).prepareMessage();
  }

  public static async createSignInErrorData(): Promise<SolanaSignInInput> {
    const now = new Date();
    const currentDateTime = now.toISOString();

    return new SiwsolMessage({
      domain: "phishing.com",
      statement: "Sign-in to connect!",
      version: "1",
      nonce: "unique-nonce-here",
      address: "solana-address-here",
      chainId: "solana:mainnet",
      issuedAt: currentDateTime,
      resources: ["https://example.com", "https://phantom.app/"],
      uri: "https://www.phishing.com",
    }).prepareMessage();
  }

  public async verify({
    payload: constructPayload,
  }: {
    payload: any;
  }): Promise<ExtendedSolanaSignInInput> {
    const deconstructPayload: {
      input: SolanaSignInInput;
      output: SolanaSignInOutput;
      account: any;
    } = JSON.parse(constructPayload);

    const backendInput = deconstructPayload.input;
    const output = deconstructPayload.output;
    const account = deconstructPayload.account;

    // Extract `data` from `Buffer` objects to create Uint8Array if necessary
    const backendOutput: SolanaSignInOutput = {
      account: {
        publicKey: account.publicKey
          ? new Uint8Array(Object.values(account.publicKey))
          : new Uint8Array(),
        address: account.address,
        chains: [],
        features: [],
      },
      signature: (output.signature as any)?.data
        ? new Uint8Array((output.signature as any)?.data)
        : new Uint8Array(),
      signedMessage: (output.signedMessage as any)?.data
        ? new Uint8Array((output.signedMessage as any).data)
        : new Uint8Array(),
    };

    if (!verifySignIn(backendInput, backendOutput)) {
      console.error("Sign In verification failed!");
      throw new Error("Sign In verification failed!");
    }
    //console.log("Sign In verification success!");

    return {
      data: backendInput,
      success: true,
    };
  }
}

/**
 * Serializes a SiwsolMessage object into a string suitable for signing and verifying.
 * @param message SiwsolMessage object
 * @returns Serialized string representation of the message.
 */
export const serializeSiwsolMessage = (message: SiwsolMessage): string => {
  return `Message:
          Domain: ${message.domain}
          Address: ${message.address}
          URI: ${message.uri}
          Statement: ${message.statement}
          Nonce: ${message.nonce}`;
};

export interface VerifySiwsolOpts {
  /** If the library should reject promises on errors, defaults to false */
  suppressExceptions?: boolean;

  /** Enables a custom verification function that will be ran alongside EIP-1271 check. */
  verificationFallback?: (
    params: VerifySiwsolParams,
    opts: VerifySiwsolOpts,
    message: SiwsolMessage,
    EIP1271Promise: Promise<SiwsolResponse>
  ) => Promise<SiwsolResponse>;
}

export interface VerifySiwsolParams {
  /** Signature of the message signed by the wallet */
  signature: string;

  /** Address of the wallet that signed the message */
  address?: string;

  /** RFC 4501 dns authority that is requesting the signing. */
  domain?: string;

  /** Randomized token used to prevent replay attacks, at least 8 alphanumeric characters. */
  nonce?: string;

  /**ISO 8601 datetime string of the current time. */
  time?: string;

  scheme?: string;
}

export const VerifySiwsolParamsKeys: Array<keyof VerifySiwsolParams> = [
  "signature",
  "address",
  "domain",
  "scheme",
  "nonce",
  "time",
];

export const VerifySiwsolOptsKeys: Array<keyof VerifySiwsolOpts> = [
  "suppressExceptions",
  "verificationFallback",
];

/**
 * Returned on verifications.
 */
export interface SiwsolResponse {
  /** Boolean representing if the message was verified with success. */
  success: boolean;

  /** If present `success` MUST be false and will provide extra information on the failure reason. */
  error?: SiwsolError;

  /** Original message that was verified. */
  data: SiwsolMessage;
}

/**
 * Interface used to return errors in SiwsolResponses.
 */
export class SiwsolError {
  constructor(
    type: SiwsolErrorType | string,
    expected?: string,
    received?: string
  ) {
    this.type = type;
    this.expected = expected;
    this.received = received;
  }

  /** Type of the error. */
  type: SiwsolErrorType | string;

  /** Expected value or condition to pass. */
  expected?: string;

  /** Received value that caused the failure. */
  received?: string;
}

/**
 * Possible message error types.
 */
export enum SiwsolErrorType {
  /** `expirationTime` is present and in the past. */
  EXPIRED_MESSAGE = "Expired message.",

  /** `domain` is not a valid authority or is empty. */
  INVALID_DOMAIN = "Invalid domain.",

  /** `domain` don't match the domain provided for verification. */
  DOMAIN_MISMATCH = "Domain does not match provided domain for verification.",

  /** `nonce` don't match the nonce provided for verification. */
  NONCE_MISMATCH = "Nonce does not match provided nonce for verification.",

  /** `address` is not a valid address. */
  INVALID_ADDRESS = "Invalid address.",

  /** `uri` does not conform to RFC 3986. */
  INVALID_URI = "URI does not conform to RFC 3986.",

  /** `nonce` is smaller then 8 characters or is not alphanumeric */
  INVALID_NONCE = "Nonce size smaller then 8 characters or is not alphanumeric.",

  /** `notBefore` is present and in the future. */
  NOT_YET_VALID_MESSAGE = "Message is not valid yet.",

  /** Signature doesn't match the address of the message. */
  INVALID_SIGNATURE = "Signature does not match address of the message.",

  /** `expirationTime`, `notBefore` or `issuedAt` not complient to ISO-8601. */
  INVALID_TIME_FORMAT = "Invalid time format.",

  /** `version` is not 1. */
  INVALID_MESSAGE_VERSION = "Invalid message version.",

  /** Thrown when some required field is missing. */
  UNABLE_TO_PARSE = "Unable to parse the message.",

  /** `scheme` is not present or is not a valid scheme. */
  SCHEME_MISMATCH = "Scheme does not match the expected scheme.",
}

export enum SIWSolStatusState {
  READY = "ready",
  LOADING = "loading",
  SUCCESS = "success",
  REJECTED = "rejected",
  ERROR = "error",
}

export type SIWSolSession = {
  address: string;
  chainId: string;
};

export type SIWSolConfig = {
  // Required
  getNonce: () => Promise<string>;
  createMessage: (args: {
    nonce: string;
    address: string;
    chainId: string;
  }) => Promise<SolanaSignInInput>;
  verifyMessage: (args: { payload: any }) => Promise<boolean>;
  getSession: () => Promise<SIWSolSession | null>;
  signOut: () => Promise<boolean>;

  // Optional, we have default values but they can be overridden
  enabled?: boolean;
  nonceRefetchInterval?: number;
  sessionRefetchInterval?: number;
  signOutOnDisconnect?: boolean;
  signOutOnAccountChange?: boolean;
  signOutOnNetworkChange?: boolean;
};
