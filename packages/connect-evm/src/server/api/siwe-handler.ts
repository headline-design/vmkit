
import { generateNonce } from "../../utils/nonce"
import { createAuthHandler } from "./create-auth-handler"
import {SiweSession} from "../session/siwe-session"
import { SiweErrorType, SiweMessage } from "siwe";

export const createSiweHandler = () => {
  return createAuthHandler({
    SessionClass: SiweSession,
    generateNonce,
    errorTypes: {
      INVALID_NONCE: SiweErrorType.INVALID_NONCE,
      INVALID_SIGNATURE: SiweErrorType.INVALID_SIGNATURE,
    },
    verifyMessage: async (body, signature, session) => {
      const { message } = body

      const siwe = new SiweMessage(JSON.parse(message || "{}"))

      // Get valid domain from environment variables
      const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "")
      const validDomain = siwe.domain === nextAuthUrl.host ? nextAuthUrl.host : siwe.domain

      const verifyData = {
        signature,
        domain: validDomain,
        nonce: session.nonce,
      }

      // Verify the message
      const { data: fields } = await siwe.verify({ ...verifyData })

      return {
        address: fields.address,
        chainId: fields.chainId,
        nonce: fields.nonce,
      }
    },
  })
}

