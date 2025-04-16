import { type NextRequest, NextResponse } from "next/server"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl

  // Skip for API routes and static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Check if we're on a subdomain
  const hostname = host.split(":")[0]
  const rootDomain = domain.split(":")[0]

  const isSubdomain =
    hostname !== rootDomain &&
    hostname !== `www.${rootDomain}` &&
    (hostname.endsWith(`.${rootDomain}`) || hostname.includes(".localhost"))

  if (isSubdomain) {
    // Extract subdomain name
    let subdomain
    if (hostname.includes(".localhost")) {
      subdomain = hostname.split(".")[0]
    } else {
      subdomain = hostname.replace(`.${rootDomain}`, "")
    }

    // If on a subdomain and trying to access landing page or admin, redirect to subdomain root
    if (pathname === "/" || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(`/`, request.url))
    }

    // If we're on a subdomain, rewrite to the subdomain page
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/subdomain/${subdomain}`, request.url))
    }
  } else {
    // On root domain, allow access to landing page and admin
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|examples|[\\w-]+\\.\\w+).*)",
  ],
}
