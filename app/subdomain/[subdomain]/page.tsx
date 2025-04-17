import { getSubdomainData } from "@/actions/subdomain"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SubdomainContent } from "@/components/subdomain-content"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

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

  return {
    title: `${subdomain}.${domain}`,
    description: `Subdomain page for ${subdomain}.${domain}`,
  }
}

// This function is cached and only runs once per subdomain per deployment
async function getCachedSubdomainData(subdomain: string) {
  "use cache"
  const data = await getSubdomainData(subdomain)
  return data
}

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string }
}) {
  const { subdomain } = params

  // Get the data using the cached function
  const data = await getCachedSubdomainData(subdomain)

  // This check runs on every request
  if (!data) {
    notFound()
  }

  // Render the content
  return <SubdomainContent subdomain={subdomain} emoji={data.emoji} />
}
