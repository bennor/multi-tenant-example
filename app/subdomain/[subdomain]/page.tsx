import { getSubdomainData } from "@/actions/subdomain"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

// Function to check if we're in a preview environment
function isPreviewEnvironment(): boolean {
  // This only runs on the server, so we need to check the headers
  if (typeof window === "undefined") {
    // In server context, we can check the host header
    // This is a simplification - in a real app, you'd use headers() from next/headers
    return process.env.VERCEL_ENV === "preview"
  }
  return false
}

// Generate metadata for the subdomain page
export async function generateMetadata({
  params,
}: {
  params: { subdomain: string }
}): Promise<Metadata> {
  const { subdomain } = params
  const data = await getSubdomainData(subdomain)

  // If subdomain doesn't exist, return default metadata
  if (!data) {
    return {
      title: domain,
    }
  }

  const inPreview = isPreviewEnvironment()
  const title = inPreview ? `${subdomain} (Preview)` : `${subdomain}.${domain}`

  return {
    title,
    description: `Subdomain page for ${subdomain}`,
  }
}

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string }
}) {
  const { subdomain } = params
  const data = await getSubdomainData(subdomain)

  if (!data) {
    notFound()
  }

  const inPreview = isPreviewEnvironment()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Subtle link back to root domain */}
      <div className="absolute top-4 right-4">
        <Link
          href={inPreview ? "/" : `https://${domain}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {domain}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">{data.emoji}</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {inPreview ? (
              <>Welcome to {subdomain} (Preview)</>
            ) : (
              <>
                Welcome to {subdomain}.{domain}
              </>
            )}
          </h1>
          <p className="mt-3 text-lg text-gray-600">This is your custom subdomain page</p>
          {inPreview && (
            <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-700 text-sm">
                You're viewing this in a preview environment. In production, this would be accessible at{" "}
                <span className="font-mono">
                  {subdomain}.{domain}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
