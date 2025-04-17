"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { verifyAdminPassword, checkAdminAuth } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PasswordProtect({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated } = await checkAdminAuth()
        setIsAuthenticated(isAuthenticated)
      } catch (err) {
        console.error("Error checking authentication:", err)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const result = await verifyAdminPassword(password)
      if (result.success) {
        setIsAuthenticated(true)
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (err) {
      setError("An error occurred during authentication")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Enter the admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            disabled={isSubmitting}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  )
}
