"use client"

import { SubdomainForm } from "./subdomain-form"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

export function LandingPage() {
  const searchParams = useSearchParams()
  const suggestedSubdomain = searchParams.get("subdomain")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      {/* Admin link */}
      <div className="absolute top-4 right-4">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Admin
        </Link>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{domain}</h1>
          <p className="mt-3 text-lg text-gray-600">Create your own subdomain with a custom emoji</p>
        </div>

        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <SubdomainForm suggestedSubdomain={suggestedSubdomain} />
        </div>
      </div>
    </div>
  )
}
