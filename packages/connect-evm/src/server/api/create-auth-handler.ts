
import { NextRequest, NextResponse } from "next/server";
import { BaseSession } from "../../server/session/base-session";

export const tap = async <T>(
  value: T,
  cb: (value: T) => Promise<unknown>,
): Promise<T> => {
  await cb(value);
  return value;
};

export interface AuthHandlerOptions<T extends BaseSession<any>> {
  // Session class constructor
  SessionClass: new (session?: any) => T;

  // Message verification functions
  verifyMessage: (message: any, signature: string, session: T) => Promise<{
    address: string;
    chainId: string | number; //solana chainId req here is problematic
    [key: string]: any;
  }>;

  // Error types for handling specific error cases
  errorTypes: {
    INVALID_NONCE: any;
    INVALID_SIGNATURE: any;
  };

  // Function to generate a nonce
  generateNonce: () => string;
}

export function createAuthHandler<T extends BaseSession<any>>(options: AuthHandlerOptions<T>) {
  const { SessionClass, verifyMessage, errorTypes, generateNonce } = options;

  return {
    // GET handler - returns the current session
    GET: async (req: NextRequest): Promise<NextResponse> => {
      const session = await (SessionClass as unknown as typeof BaseSession).fromRequest(req);
      return new NextResponse(JSON.stringify(session.toJSON()), {
        headers: { "Content-Type": "application/json" }
      });
    },

    // PUT handler - generates a nonce and persists it to the session
    PUT: async (req: NextRequest): Promise<NextResponse> => {
      const session = await (SessionClass as unknown as typeof BaseSession).fromRequest(req);
      if (!session?.nonce) session.nonce = generateNonce();

      return tap(new NextResponse(session.nonce), (res: any) =>
        session.persist(res)
      );
    },

    // POST handler - verifies a signed message and updates the session
    POST: async (req: NextRequest): Promise<NextResponse> => {
      const session = await (SessionClass as unknown as typeof BaseSession).fromRequest(req);

      try {
        const body = await req.json();

        // Verify the message and get the fields
        const fields = await verifyMessage(body, body.signature, session as T);

        if (fields.nonce !== session.nonce) {
          return tap(new NextResponse("Invalid nonce.", { status: 422 }), (res) =>
            session.clear(res)
          );
        }

        session.address = fields.address;
        session.chainId = typeof fields.chainId === 'number' ? fields.chainId : undefined;
        session.nonce = undefined;

        if (!session.address) {
          return tap(new NextResponse("Invalid address.", { status: 422 }), (res) =>
            session.clear(res)
          );
        }

        return tap(new NextResponse(""), (res) => session.persist(res));
      } catch (error) {
        if (
          error === errorTypes.INVALID_NONCE ||
          error === errorTypes.INVALID_SIGNATURE
        ) {
          return tap(new NextResponse(String(error), { status: 422 }), (res) =>
            session.clear(res)
          );
        }

        return tap(new NextResponse(String(error), { status: 400 }), (res) =>
          session.clear(res)
        );
      }
    },

    // DELETE handler - clears the session
    DELETE: async (req: NextRequest): Promise<NextResponse> => {
      const session = await (SessionClass as unknown as typeof BaseSession).fromRequest(req);
      if (!session) {
        return new NextResponse("Session not found", { status: 404 });
      }

      return tap(new NextResponse(""), (res) => session.clear(res));
    }
  };
}

