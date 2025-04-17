import { AdminDashboard } from "@/components/admin/dashboard"
import { PasswordProtect } from "@/components/admin/password-protect"
import type { Metadata } from "next"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

export const metadata: Metadata = {
  title: `Admin Dashboard | ${domain}`,
  description: `Manage subdomains for ${domain}`,
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <PasswordProtect>
        <AdminDashboard />
      </PasswordProtect>
    </div>
  )
}
