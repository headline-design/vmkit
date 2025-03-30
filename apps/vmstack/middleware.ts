import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { LOCAL_DOMAIN } from "./lib/constants";
import { parse } from "./lib/middleware/utils";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|manifest.json|favicon.ico|favicon.svg|assets|sitemap.xml|robots.txt).*)",
  ],
};

export default async function middleware(
  req: NextRequest,
  ev: NextFetchEvent,
  res: NextResponse
) {
  const { path, key } = parse(req);

  const hostname = req.headers
    .get("host")!
    .replace(`${LOCAL_DOMAIN}`, `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // for root pages (e.g. vmkit.xyz, vercel.fyi, etc.)
  if (key.length === 0) {
    return NextResponse.next();
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
