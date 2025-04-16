import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">404 - Subdomain Not Found</h1>
        <p className="mt-3 text-lg text-gray-600">This subdomain doesn't exist or hasn't been created yet.</p>
        <div className="mt-6">
          <Link href="/" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
