import { SiwsSession } from "../session/siws-session"
import { createAuthHandler } from "./create-auth-handler"
import { generateNonce } from "../../utils/nonce"
import { Address, verifySIWS } from "@talismn/siws"
import { SiwsErrorType } from "../../siws-root/utils"

export const createSiwsHandler = () => {
  return createAuthHandler({
    SessionClass: SiwsSession,
    generateNonce,
    errorTypes: {
      INVALID_NONCE: SiwsErrorType.INVALID_NONCE,
      INVALID_SIGNATURE: SiwsErrorType.INVALID_SIGNATURE,
    },
    verifyMessage: async (body, signature) => {
      const { message: baseMessage, address: preAddress } = body

      if (!baseMessage || !signature || !preAddress) {
        throw new Error("Missing required fields")
      }

      const baseAddress = Address.fromSs58(preAddress)

      if (!baseAddress) {
        throw new Error("Invalid address format")
      }

      const address = baseAddress.toSs58(0)
      let message

      try {
        message = JSON.parse(baseMessage)
      } catch (error) {
        throw new Error("Invalid message format")
      }

      // Verify the message
      const fields = await verifySIWS(message, signature, address, {
        disableAzeroId: true,
      })

      return {
        address: fields.address,
        chainId: 135, // Substrate chain ID
        nonce: fields.nonce,
      }
    },
  })
}

