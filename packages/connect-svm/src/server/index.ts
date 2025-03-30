// Server-side entry point
// Export only server-safe utilities

// Export session classes
export {
  SiwsolSession,
  ISiwsolSession,
  BaseSession,
  IBaseSession,
} from "./session";

// Export other server utilities
export { generateNonce } from "../utils/nonce";

export {
  SiwsolError,
  SiwsolErrorType,
  SiwsolMessage,
  SiwsolResponse,
  serializeSiwsolMessage,
  SIWSolConfig,
  SIWSolSession,
} from "../siwsol-root/utils";

export * from "./session/index";

export {
  createAuthHandler,
  tap,
  createSiwsolHandler,
} from "./api";
