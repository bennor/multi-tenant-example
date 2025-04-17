"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createSubdomain } from "@/actions/subdomain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

interface SubdomainFormProps {
  suggestedSubdomain?: string | null
}

export function SubdomainForm({ suggestedSubdomain }: SubdomainFormProps) {
  const [subdomain, setSubdomain] = useState("")
  const [emoji, setEmoji] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const emojiInputRef = useRef<HTMLInputElement>(null)

  // Set the suggested subdomain when the component mounts or when it changes
  useEffect(() => {
    if (suggestedSubdomain) {
      setSubdomain(suggestedSubdomain)

      // Focus on the emoji input if we have a suggested subdomain
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        emojiInputRef.current?.focus()
      }, 100)
    }
  }, [suggestedSubdomain])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await createSubdomain(subdomain, emoji)
      if (result.success) {
        // Redirect to the new subdomain
        const protocol = window.location.protocol
        router.push(`${protocol}//${subdomain}.${domain}`)
      } else {
        setError(result.error || "Something went wrong")
      }
    } catch (err) {
      setError("Failed to create subdomain")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subdomain">Subdomain</Label>
        <div className="flex items-center">
          <div className="relative flex-1">
            <Input
              id="subdomain"
              placeholder="your-subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="w-full rounded-r-none focus:z-10"
              required
            />
          </div>
          <span className="bg-gray-100 px-3 py-2 border border-l-0 border-input rounded-r-md text-gray-500 min-h-[40px] flex items-center">
            .{domain}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emoji">Icon</Label>
        <Input
          id="emoji"
          ref={emojiInputRef}
          placeholder="Enter an emoji or special character"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          required
          maxLength={2}
        />
        <p className="text-xs text-gray-500">Enter a single emoji or special character (e.g., ▲, ★, ♥)</p>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Subdomain"}
      </Button>
    </form>
  )
}
