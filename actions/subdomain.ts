"use server"

import { kv } from "@vercel/kv"
import { cache } from "react"

type SubdomainData = {
  emoji: string
  createdAt: number
}

// Regex to check if a string contains only emoji characters
function isEmoji(str: string) {
  // This regex pattern matches most common emoji characters
  const emojiRegex =
    /^(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component})+$/u
  return emojiRegex.test(str) && str.length === 2
}

export async function createSubdomain(subdomain: string, emoji: string) {
  try {
    // Validate inputs
    if (!subdomain || !emoji) {
      return { success: false, error: "Subdomain and emoji are required" }
    }

    // Validate emoji
    if (!isEmoji(emoji)) {
      return { success: false, error: "Please enter a valid emoji character" }
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

// Use React's cache function to memoize the getSubdomainData function
export const getSubdomainData = cache(async (subdomain: string) => {
  try {
    const data = await kv.get<SubdomainData>(`subdomain:${subdomain}`)
    return data
  } catch (error) {
    console.error("Error getting subdomain data:", error)
    return null
  }
})
