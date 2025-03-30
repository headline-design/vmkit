import { NextRequest } from "next/server";
import { LOCAL_DOMAIN, ROOT_DOMAIN } from "../constants";

export const parse = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // remove www. from domain
  if (domain === `${LOCAL_DOMAIN}` || domain === "staging.vmkit.xyz") {
    // for local development and staging environments
    domain = "vmkit.xyz";
  }

  // path is the path of the URL (e.g. vmkit.sh/stats/github -> /stats/github)
  let path = req.nextUrl.pathname;

  // special case for vmkit.xyz/___xpsace_check/ (for checking if vmkit.xyz links are working)
  if (path.startsWith("/___siwa_check/")) {
    domain = "vmkit.xyz";
    path = path.replace("/___siwa_check/", "/");
  }

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${path}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
  const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. vmkit.xyz/stats/github -> stats)
  const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. vmkit.xyz/github/repo -> github/repo)

  return { domain, path, fullPath, key, fullKey };
};

export const getFinalUrl = (target: string, { req }: { req: NextRequest }) => {
  // query is the query string (e.g. vmkit.xyz/github/repo?utm_source=twitter -> ?utm_source=twitter)
  const searchParams = req.nextUrl.searchParams;

  // get the query params of the target url
  const targetUrl = new URL(decodeURIComponent(target));

  // @ts-ignore – until https://github.com/microsoft/TypeScript/issues/54466 is fixed
  if (searchParams.size === 0) return targetUrl.toString(); // if there are no query params, then return the target url as is (no need to parse it)

  // if searchParams (type: `URLSearchParams`) has the same key as target url, then overwrite it
  for (const [key, value] of searchParams) {
    targetUrl.searchParams.set(key, value);
  }

  // construct final url
  const finalUrl = targetUrl.toString();

  return finalUrl;
};


export const parseSubdomain = (req: NextRequest) => {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // Remove 'www.' from domain

  // Handle local development and staging environment domains
  if (domain === `${LOCAL_DOMAIN}` || domain === "staging.vmkit.xyz") {
    domain = "vmkit.xyz";
  }

  // Extract the subdomain part
  const domainParts = domain.split(".");
  let subdomain = "";

  // Assuming the format is [subdomain].[domain].[tld]
  if (domainParts.length >= 3 || domainParts[1] === ROOT_DOMAIN) {
    subdomain = domainParts[0];
  }

  return subdomain;
};
