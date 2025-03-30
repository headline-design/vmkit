import { sealData, type SessionOptions } from "iron-session";
import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { NextRequest, NextResponse } from "next/server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { isNode } from "../../utils/environment";

// Base session interface that all specific session types will extend
export interface IBaseSession {
  nonce?: string;
  address?: string;
  teamId?: string;
  userId?: string;
  chainId?: number;
  [key: string]: unknown; // Allow for additional properties
}

// Utility function to ensure correct type inference for cookies
export const getCookiesObject = (
  res: NextResponse | ResponseCookies
): ResponseCookies => {
  return (res as NextResponse).cookies ?? (res as ResponseCookies);
};

// Base session class that specific session implementations will extend
export abstract class BaseSession<T extends IBaseSession = IBaseSession> {
  nonce?: string;
  address?: string;
  teamId?: string;
  userId?: string;
  chainId?:number;

  // Each implementation must provide these
  protected abstract cookieName: string;
  protected abstract sessionOptions: SessionOptions;

  constructor(session?: T) {
    this.nonce = session?.nonce;
    this.address = session?.address;
    this.teamId = session?.teamId;
    this.userId = session?.userId;
    this.chainId = session?.chainId;

    // Environment check
    if (!isNode()) {
      console.warn("Session classes should only be used on the server side");
    }
  }

  // Static method to create from cookies - to be implemented by subclasses
  static async fromCookies<S extends BaseSession>(
    this: abstract new (session?: IBaseSession) => S,
    _cookies: ReadonlyRequestCookies
  ): Promise<S> {
    throw new Error("Method must be implemented by subclass");
  }

  // Static method to create from request - to be implemented by subclasses
  static async fromRequest<S extends BaseSession>(
    this: abstract new (session?: IBaseSession) => S,
    _req: NextRequest
  ): Promise<S> {
    throw new Error("Method must be implemented by subclass");
  }

  // Clear session data
  async clear(res: NextResponse | ResponseCookies): Promise<void> {
    this.nonce = undefined;
    this.address = undefined;
    this.teamId = undefined;
    this.userId = undefined;

    await this.persist(res);
  }

  // Convert to JSON - can be overridden by subclasses if needed
  toJSON(): T {
    return {
      nonce: this.nonce,
      address: this.address,
      teamId: this.teamId,
      userId: this.userId,
    } as T;
  }

  // Persist session to cookies
  async persist(res: NextResponse | ResponseCookies): Promise<void> {
    const cookies = getCookiesObject(res);
    try {
      const sealedData = await sealData(this.toJSON(), this.sessionOptions);

      // Use a hardcoded value for secure in development, and let it be overridden in production
      // @ts-ignore - Ignore TypeScript error about string comparison
      const secure = process.env.NODE_ENV === "production";

      cookies.set(this.cookieName, sealedData, {
        httpOnly: true,
        secure: secure,
      });
    } catch (error) {
      console.error("persist: Error sealing or setting cookie", error);
      throw error;
    }
  }
}

// Helper to check if an object is ResponseCookies
export const isCookies = (
  cookies: NextResponse | ResponseCookies
): cookies is ResponseCookies => {
  return (cookies as ResponseCookies).set !== undefined;
};
