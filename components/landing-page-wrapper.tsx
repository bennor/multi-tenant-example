"use client"

import { useSearchParams } from "next/navigation"
import { LandingPage } from "./landing-page"

export function LandingPageWrapper() {
  const searchParams = useSearchParams()
  const suggestedSubdomain = searchParams.get("subdomain")

  return <LandingPage suggestedSubdomain={suggestedSubdomain} />
}
