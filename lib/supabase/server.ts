import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isValidUrl = (u: string | undefined) => u && u.startsWith('https://') && !u.includes('YOUR_PROJECT') && !u.includes('placeholder') && !u.includes('PASTE_SUPABASE')

  if (!isValidUrl(url) || !key || key.includes('YOUR_SUPABASE') || key.includes('PASTE_SUPABASE')) {
    if (url || key) {
      console.error('[Supabase Server] Invalid or placeholder credentials detected.')
    }
    return null;
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
