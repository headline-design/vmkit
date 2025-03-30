import { SiwaSession } from "../session/siwa-session";
import { createAuthHandler } from "./create-auth-handler";
import { SiwaMessage, SiwaErrorType, generateNonce } from "@avmkit/siwa";

export const createSiwaHandler = () => {
  return createAuthHandler({
    SessionClass: SiwaSession,
    generateNonce,
    errorTypes: {
      INVALID_NONCE: SiwaErrorType.INVALID_NONCE,
      INVALID_SIGNATURE: SiwaErrorType.INVALID_SIGNATURE,
    },
    verifyMessage: async (body, signature, session) => {
      const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");

      const { message, nfd,  transaction } = body;

      const siwa = new SiwaMessage(JSON.parse(message || "{}"));

      if (!siwa) {
        throw new Error("Invalid SIWA message");
      }

      // Get valid domain from environment variables
      const validDomain = siwa.domain === nextAuthUrl.host ? nextAuthUrl.host : siwa.domain;

      const verifyData = {
        signature,
        domain: validDomain,
        nonce: session.nonce,
        encodedTransaction: transaction || null,
        nfd: undefined as string | undefined, // Optional, can be set to undefined if not needed
      };

      if (nfd) {
        verifyData.nfd = nfd;
      }

      // Verify the message
      const { data: fields } = await siwa.verify({ ...verifyData });

      return {
        address: fields.address,
        chainId: fields.chainId,
        nonce: fields.nonce,
      };
    },
  });
};
