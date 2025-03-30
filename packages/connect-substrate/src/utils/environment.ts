/**
 * Environment detection utilities
 */

// Check if code is running in a browser environment
export const isBrowser = (): boolean => {
    return typeof window !== "undefined" && typeof document !== "undefined"
  }

  // Check if code is running in a Node.js environment
  export const isNode = (): boolean => {
    return typeof process !== "undefined" && process.versions != null && process.versions.node != null
  }

  // Safe window access
  export const getWindow = (): Window | undefined => {
    return isBrowser() ? window : undefined
  }

  // Safe document access
  export const getDocument = (): Document | undefined => {
    return isBrowser() ? document : undefined
  }

