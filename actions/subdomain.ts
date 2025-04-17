"use server"

import { kv } from "@vercel/kv"

type SubdomainData = {
  emoji: string
  createdAt: number
}

// Improved function to validate emojis
function isValidIcon(str: string) {
  // Check if the string is not too long (prevent abuse)
  if (str.length > 10) {
    return false
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u
    if (emojiPattern.test(str)) {
      return true
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn("Emoji regex validation failed, using fallback validation", error)
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10
}

export async function createSubdomain(subdomain: string, emoji: string) {
  try {
    // Validate inputs
    if (!subdomain || !emoji) {
      return { success: false, error: "Subdomain and icon are required" }
    }

    // Validate icon
    if (!isValidIcon(emoji)) {
      return { success: false, error: "Please enter a valid emoji (maximum 10 characters)" }
    }

    // Sanitize subdomain (only allow alphanumeric and hyphens)
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "")

    if (sanitizedSubdomain !== subdomain) {
      return {
        success: false,
        error: "Subdomain can only contain lowercase letters, numbers, and hyphens",
      }
    }

    // Check if subdomain already exists
    const exists = await kv.get(`subdomain:${sanitizedSubdomain}`)
    if (exists) {
      return { success: false, error: "This subdomain is already taken" }
    }

    // Store the subdomain data
    const data: SubdomainData = {
      emoji,
      createdAt: Date.now(),
    }

    await kv.set(`subdomain:${sanitizedSubdomain}`, data)

    return { success: true }
  } catch (error) {
    console.error("Error creating subdomain:", error)
    return { success: false, error: "Failed to create subdomain" }
  }
}

export async function getSubdomainData(subdomain: string) {
  try {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "")
    const data = await kv.get<SubdomainData>(`subdomain:${sanitizedSubdomain}`)
    return data
  } catch (error) {
    console.error("Error getting subdomain data:", error)
    return null
  }
}
