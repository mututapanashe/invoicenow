import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

export default async function HomePage() {
  let userEmail: string | null = null
  const supabaseConfigured = hasSupabaseEnv()

  if (supabaseConfigured) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userEmail = user?.email ?? null
    } catch {
      userEmail = null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Panatech Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">Invoice management starter with Supabase authentication.</p>

          {supabaseConfigured ? (
            userEmail ? (
              <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                Logged in as {userEmail}
              </p>
            ) : (
              <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
                Supabase is configured. You can register and login now.
              </p>
            )
          ) : (
            <>
              <p className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                Authentication is temporarily unavailable. Please try again shortly.
              </p>
              {process.env.NODE_ENV !== 'production' ? (
                <p className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-600">
                  Developer note: set `NEXT_PUBLIC_SUPABASE_URL` and
                  `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
                </p>
              ) : null}
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Register
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
