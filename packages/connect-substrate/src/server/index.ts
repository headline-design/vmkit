// Server-side entry point
// Export only server-safe utilities

// Export session classes
export {
  SiwsSession,
  ISiwsSession,
  BaseSession,
  IBaseSession,
} from "./session";

// Export other server utilities
export { generateNonce } from "../utils/nonce";

export {
  SiwsError,
  SiwsErrorType,
  SiwsResponse,
  VerifySiwsParamsKeys,
  VerifySiwsOpts,
} from "../siws-root/utils";

export * from "./session/index";

export {
  createAuthHandler,
  tap,
  createSiwsHandler,
} from "./api";
