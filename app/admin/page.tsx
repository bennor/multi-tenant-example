import { AdminDashboard } from "@/components/admin/dashboard"
import { PasswordProtect } from "@/components/admin/password-protect"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <PasswordProtect>
        <AdminDashboard />
      </PasswordProtect>
    </div>
  )
}
