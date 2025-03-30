
export const SWIPE_REVEAL_ANIMATION_SETTINGS = {
  initial: { height: 0 },
  animate: { height: "auto" },
  exit: { height: 0 },
  transition: { duration: 0.15, ease: "easeOut" },
};

export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const PAGINATION_LIMIT = 100;

export const HOME_HOSTNAMES = new Set([
  "localhost:8888",
  "localhost",
  "vmkit.xyz",
]);

export const isHomeHostname = (domain: string) => {
  return HOME_HOSTNAMES.has(domain) || domain.endsWith("vmkit.xyz");
};

export const ROOT_HTTP =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? "http://"
      : "http://";

export const LOCAL_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "localhost:8888"
    : "192.168.1.160:8888";

export const LOCAL_DEPLOYMENT =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "localhost"
    : "192.168.1.160";

export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "vmkit.xyz"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? "localhost:8888"
      : "192.168.1.160:8888";

export const HOME_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://vmstacl.vmkit.xyz";

export const VMKIT_HEADERS = {
  headers: {
    "x-powered-by": "vmkit.xyz - Discover Web`",
  },
};
