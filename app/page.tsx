import { Suspense } from "react"
import { LandingPageWrapper } from "@/components/landing-page-wrapper"

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LandingPageWrapper />
    </Suspense>
  )
}
