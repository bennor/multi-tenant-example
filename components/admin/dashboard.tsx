"use client"

import { useEffect, useState } from "react"
import { getAllSubdomains, deleteSubdomain } from "@/actions/admin"
import { logoutAdmin } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, RefreshCw, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

type Tenant = {
  subdomain: string
  emoji: string
  createdAt: number
}

export function AdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const loadTenants = async () => {
    setIsLoading(true)
    try {
      const data = await getAllSubdomains()
      setTenants(data)
    } catch (error) {
      console.error("Failed to load tenants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTenants()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await deleteSubdomain(deleteTarget)
      setTenants(tenants.filter((t) => t.subdomain !== deleteTarget))
      setDeleteTarget(null)
    } catch (error) {
      console.error("Failed to delete subdomain:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      // Redirect to the landing page after logout
      router.push("/")
    } catch (error) {
      console.error("Failed to logout:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6 relative p-4 md:p-8">
      {/* Header with navigation links */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Subdomain Management</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={loadTenants}
            variant="outline"
            disabled={isLoading}
            size="sm"
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Link href={`https://${domain}`} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            {domain}
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut} className="text-gray-500">
            <LogOut className="h-4 w-4 mr-1" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      {isLoading && tenants.length === 0 ? (
        <div className="text-center py-8">Loading subdomains...</div>
      ) : tenants.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No subdomains have been created yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card key={tenant.subdomain}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tenant.subdomain}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(tenant.subdomain)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{tenant.emoji}</div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(tenant.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={`https://${tenant.subdomain}.${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Visit subdomain →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subdomain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the subdomain <strong>{deleteTarget}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
