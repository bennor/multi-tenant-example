"use client"

import { useSearchParams } from "next/navigation"
import { LandingPage } from "./landing-page"
import { useEffect, useState } from "react"

export function LandingPageWrapper() {
  const searchParams = useSearchParams()
  const [suggestedSubdomain, setSuggestedSubdomain] = useState<string | null>(null)

  useEffect(() => {
    // First check URL parameters
    const subdomain = searchParams.get("subdomain")
    if (subdomain) {
      setSuggestedSubdomain(subdomain)
      return
    }

    // Then check if we're in a preview environment with a subdomain pattern
    const hostname = window.location.hostname
    const isPreview = hostname.includes("vercel.app") || hostname.includes(".preview.app")

    if (isPreview) {
      const hostnameParts = hostname.split(".")
      const previewParts = hostnameParts[0].split("---")

      // If there's a tenant prefix in the preview URL
      if (previewParts.length > 1) {
        setSuggestedSubdomain(previewParts[0])
      }
    }
  }, [searchParams])

  return <LandingPage suggestedSubdomain={suggestedSubdomain} />
}
