import { getSubdomainData } from "@/actions/subdomain"
import { notFound } from "next/navigation"

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <div className="text-9xl mb-6">{data.emoji}</div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome to {subdomain}.localhost:3000</h1>
        <p className="mt-3 text-lg text-gray-600">This is your custom subdomain page</p>
      </div>
    </div>
  )
}
