"use server"

import { cookies } from "next/headers"

// Admin authentication
export async function verifyAdminPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set")
    return { success: false, error: "Server configuration error" }
  }

  if (password === adminPassword) {
    // Set a cookie that expires in 24 hours
    cookies().set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
    return { success: true }
  }

  return { success: false, error: "Incorrect password" }
}

export async function checkAdminAuth() {
  const isAuthenticated = cookies().get("admin_authenticated")?.value === "true"
  return { isAuthenticated }
}

export async function logoutAdmin() {
  cookies().delete("admin_authenticated")
  return { success: true }
}
