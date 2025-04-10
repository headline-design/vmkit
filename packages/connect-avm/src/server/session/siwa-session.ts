import { unsealData, type SessionOptions } from "iron-session";
import type { NextRequest } from "next/server";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { BaseSession, IBaseSession } from "./base-session";

export const APP_NAME = "Next Siwa App";
export const COOKIE_NAME = "web3AVMsession";

// Check for required environment variables
if (typeof process !== "undefined" && process.env && typeof window === "undefined") {
  if (!process.env.SESSION_SECRET ) {
    console.error("SESSION_SECRET cannot be empty for SIWA session.");
  }
}

export const SESSION_OPTIONS: SessionOptions = {
  ttl: 60 * 60 * 24 * 30, // 30 days
  password:
    process.env.SESSION_SECRET || "DEVELOPMENT_SECRET_DO_NOT_USE_IN_PRODUCTION",
  cookieName: COOKIE_NAME,
};

export interface ISiwaSession extends IBaseSession {
  chainId?: number;
}

export class SiwaSession extends BaseSession<ISiwaSession> {
  chainId?: number;
  protected cookieName = COOKIE_NAME;
  protected sessionOptions = SESSION_OPTIONS;

  constructor(session?: ISiwaSession) {
    super(session);
    this.chainId = session?.chainId;
  }

  static async fromCookies<S extends BaseSession>(
    this: { new (session?: ISiwaSession): S }, // Remove `abstract`
    cookies: ReadonlyRequestCookies
  ): Promise<S> {
    const sessionCookie = cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) throw new Error("Not authenticated");

    const sessionData = await unsealData<ISiwaSession>(
      sessionCookie,
      SESSION_OPTIONS
    );
    return new this(sessionData); // Ensures proper instantiation
  }

  static async fromRequest<S extends BaseSession>(
    this: { new (session?: ISiwaSession): S }, // Remove `abstract`
    req: NextRequest
  ): Promise<S> {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;

    if (!sessionCookie) return new this(); // Ensures proper instantiation
    const sessionData = await unsealData<ISiwaSession>(
      sessionCookie,
      SESSION_OPTIONS
    );
    return new this(sessionData);
  }

  toJSON(): ISiwaSession {
    return {
      ...super.toJSON(),
      chainId: this.chainId,
    };
  }
}

export default SiwaSession;
