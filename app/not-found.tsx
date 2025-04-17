import Link from "next/link"
import type { Metadata } from "next"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

export const metadata: Metadata = {
  title: domain,
  description: `Page not found on ${domain}`,
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">404 - Subdomain Not Found</h1>
        <p className="mt-3 text-lg text-gray-600">This subdomain doesn't exist or hasn't been created yet.</p>
        <div className="mt-6">
          <Link
            href={`https://${domain}`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to {domain}
          </Link>
        </div>
      </div>
    </div>
  )
}
