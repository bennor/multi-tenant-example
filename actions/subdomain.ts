"use server"

import { kv } from "@vercel/kv"

type SubdomainData = {
  emoji: string
  createdAt: number
}

// Updated function to check if a string contains a valid icon (emoji or special character)
function isValidIcon(str: string) {
  // Allow any single character or emoji (which can be 2 characters in JS)
  return str.length <= 2
}

export async function createSubdomain(subdomain: string, emoji: string) {
  try {
    // Validate inputs
    if (!subdomain || !emoji) {
      return { success: false, error: "Subdomain and icon are required" }
    }

    // Validate icon
    if (!isValidIcon(emoji)) {
      return { success: false, error: "Please enter a valid emoji or special character" }
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
