"use cache"

import Link from "next/link"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

interface SubdomainContentProps {
  subdomain: string
  emoji: string
}

export function SubdomainContent({ subdomain, emoji }: SubdomainContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Subtle link back to root domain */}
      <div className="absolute top-4 right-4">
        <Link href={`https://${domain}`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          {domain}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">{emoji}</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to {subdomain}.{domain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">This is your custom subdomain page</p>
        </div>
      </div>
    </div>
  )
}
