import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the application.
 * Supports production, Vercel preview deployments, and local development.
 */
export function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Production URL (set in Vercel)
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Vercel preview URL
    'http://localhost:3000'

  // Ensure URL has protocol
  url = url.startsWith('http') ? url : `https://${url}`
  // Ensure URL has trailing slash
  url = url.endsWith('/') ? url : `${url}/`

  return url
}
