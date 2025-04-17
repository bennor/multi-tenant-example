"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

export default function NotFound() {
  const [subdomain, setSubdomain] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if we're in a preview environment
    const hostname = window.location.hostname
    const isPreviewEnv = hostname.includes("vercel.app") || hostname.includes(".preview.app")
    setIsPreview(isPreviewEnv)

    // Extract subdomain from URL if we're on a subdomain page
    if (pathname?.startsWith("/subdomain/")) {
      const extractedSubdomain = pathname.split("/")[2]
      if (extractedSubdomain) {
        setSubdomain(extractedSubdomain)
      }
    } else if (isPreviewEnv) {
      // In preview, check for tenant---branch-name.vercel.app pattern
      const hostnameParts = hostname.split(".")
      const previewParts = hostnameParts[0].split("---")

      if (previewParts.length > 1) {
        setSubdomain(previewParts[0])
      }
    } else {
      // Standard environment - try to extract from hostname
      const rootDomain = domain.split(":")[0]
      if (hostname.endsWith(`.${rootDomain}`) || hostname.includes(".localhost")) {
        const extractedSubdomain = hostname.split(".")[0]
        setSubdomain(extractedSubdomain)
      }
    }
  }, [pathname])

  // Determine the root URL based on environment
  const getRootUrl = () => {
    if (isPreview) {
      // In preview, we need to go to the root of the preview deployment
      const currentUrl = window.location.href
      const urlParts = currentUrl.split("---")
      if (urlParts.length > 1) {
        // Remove the subdomain prefix from the URL
        return urlParts[1]
      }
      // If no subdomain pattern found, just use the origin
      return window.location.origin
    }
    // In production or local, use the configured domain
    return `https://${domain}`
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {subdomain ? (
            <>
              <span className="text-blue-600">{subdomain}</span>
              {isPreview ? " subdomain" : `.${domain}`} doesn't exist
            </>
          ) : (
            "Subdomain Not Found"
          )}
        </h1>
        <p className="mt-3 text-lg text-gray-600">This subdomain hasn't been created yet.</p>
        <div className="mt-6">
          <Link
            href={subdomain ? `${getRootUrl()}?subdomain=${subdomain}` : getRootUrl()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {subdomain ? `Create ${subdomain}` : `Go to homepage`}
          </Link>
        </div>
      </div>
    </div>
  )
}
