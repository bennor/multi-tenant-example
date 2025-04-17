"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createSubdomain } from "@/actions/subdomain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import { Card } from "@/components/ui/card"

// Get the domain from environment variable or use a default
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000"

interface SubdomainFormProps {
  suggestedSubdomain?: string | null
}

export function SubdomainForm({ suggestedSubdomain }: SubdomainFormProps) {
  const [subdomain, setSubdomain] = useState("")
  const [icon, setIcon] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const router = useRouter()

  // Set the suggested subdomain when the component mounts or when it changes
  useEffect(() => {
    if (suggestedSubdomain) {
      setSubdomain(suggestedSubdomain)
    }
  }, [suggestedSubdomain])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await createSubdomain(subdomain, icon)
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

  const handleEmojiSelect = (emoji: string) => {
    setIcon(emoji)
    setIsPickerOpen(false)
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
        <Label htmlFor="icon">Icon</Label>
        <div className="flex flex-col gap-2">
          {/* Hidden input for form submission */}
          <input type="hidden" name="icon" value={icon} required />

          {/* Icon display and picker button */}
          <div className="flex items-center gap-2">
            <Card className="flex-1 flex items-center justify-between p-2 border border-input">
              <div className="text-3xl min-w-[40px] min-h-[40px] flex items-center justify-center">
                {icon || <span className="text-gray-400 text-sm">No icon selected</span>}
              </div>
              <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                  >
                    <Smile className="h-4 w-4 mr-2" />
                    Select Icon
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="end" sideOffset={5}>
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </PopoverContent>
              </Popover>
            </Card>
          </div>
          <p className="text-xs text-gray-500">Select an emoji or special character to represent your subdomain</p>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full" disabled={isLoading || !icon || !subdomain.trim()}>
        {isLoading ? "Creating..." : "Create Subdomain"}
      </Button>
    </form>
  )
}
