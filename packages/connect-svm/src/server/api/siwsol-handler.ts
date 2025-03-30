import { SiwsolSession } from "../session/siwsol-session"
import { createAuthHandler } from "./create-auth-handler"
import { generateNonce } from "../../utils/nonce"
import { SiwsolErrorType, SiwsolMessage } from "../../siwsol-root/utils"

export const createSiwsolHandler = () => {
  return createAuthHandler({
    SessionClass: SiwsolSession,
    generateNonce,
    errorTypes: {
      INVALID_NONCE: SiwsolErrorType.INVALID_NONCE,
      INVALID_SIGNATURE: SiwsolErrorType.INVALID_SIGNATURE,
    },
    verifyMessage: async (body) => {
      const { payload } = body

      const deconstructPayload = JSON.parse(payload)
      const input = deconstructPayload.input

      const siwsol = new SiwsolMessage({
        domain: input.domain,
        statement: input.statement,
        version: input.version,
        nonce: input.nonce,
        chainId: input.chainId,
        address: input.address,
        issuedAt: input.issuedAt,
        resources: input.resources,
        uri: input.uri,
      })

      // Verify the message
      const { data: fields } = await siwsol.verify({ payload })

      if (!fields || !fields.address || !fields.chainId) {
        throw new Error("Invalid fields")
      }

      return {
        address: fields.address,
        chainId: fields.chainId,
        nonce: fields.nonce,
      }
    },
  })
}

