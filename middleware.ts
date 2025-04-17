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

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  const isPreviewDeployment = hostname.includes("---") && hostname.endsWith(".vercel.app")

  let subdomain: string | null = null

  if (isPreviewDeployment) {
    // Extract subdomain from preview URL (format: tenant---branch-name.vercel.app)
    const parts = hostname.split("---")
    if (parts.length > 0) {
      subdomain = parts[0]
    }
  } else {
    // Regular subdomain detection
    const isSubdomain =
      hostname !== rootDomain &&
      hostname !== `www.${rootDomain}` &&
      (hostname.endsWith(`.${rootDomain}`) || hostname.includes(".localhost"))

    if (isSubdomain) {
      // Extract subdomain name
      if (hostname.includes(".localhost")) {
        subdomain = hostname.split(".")[0]
      } else {
        subdomain = hostname.replace(`.${rootDomain}`, "")
      }
    }
  }

  // If we have a subdomain (either from regular URL or preview deployment)
  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // For the root path on a subdomain, rewrite to the subdomain page
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/subdomain/${subdomain}`, request.url))
    }
  }

  // On the root domain, allow normal access
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
