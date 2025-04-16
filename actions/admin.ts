"use server"

import { kv } from "@vercel/kv"

type SubdomainData = {
  emoji: string
  createdAt: number
}

export async function getAllSubdomains() {
  try {
    // Get all keys that match the pattern "subdomain:*"
    const keys = await kv.keys("subdomain:*")

    if (!keys.length) {
      return []
    }

    // Get all values for the keys
    const values = await kv.mget<SubdomainData[]>(...keys)

    // Map keys and values to an array of objects
    return keys.map((key, index) => {
      const subdomain = key.replace("subdomain:", "")
      const data = values[index]

      return {
        subdomain,
        emoji: data?.emoji || "❓",
        createdAt: data?.createdAt || Date.now(),
      }
    })
  } catch (error) {
    console.error("Error getting all subdomains:", error)
    return []
  }
}

export async function deleteSubdomain(subdomain: string) {
  try {
    // Delete the subdomain data
    await kv.del(`subdomain:${subdomain}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting subdomain:", error)
    return { success: false, error: "Failed to delete subdomain" }
  }
}
