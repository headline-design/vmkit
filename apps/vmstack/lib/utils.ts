import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"
import { HOME_DOMAIN } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PAGINATION_LIMIT = 100;

export function constructMetadata({
  title = "VMkit - Native auth for Web3 teams",
  description = "Discover Web3 with VMkit.",
  image = "https://vmstack.vmkit.xyz/assets/og-image.png",
  icons = "/favicon.svg",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@headline_crypto",
    },
    icons,
    manifest: "/manifest.json",
    metadataBase: new URL(HOME_DOMAIN || ""),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}


export const getSearchParams = (url: string) => {
  // Create a params object
  let params = {} as Record<string, string>;

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val;
  });

  return params;
};


export function shortenAddress(str = "") {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === "number") limit = key;
  if (key === "symbol") limit = 6;
  if (key === "name") limit = 64;
  if (key === "choice") limit = 12;
  if (limit)
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function truncateMicroString(str, pad = 5) {
  if (str) {
    const { length } = str;
    const start = str.substring(0, pad);
    return `${start}...${str.substring(length - pad, length)}`;
  }
}