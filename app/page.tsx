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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl border-amber-300/30">
        <CardHeader>
          <CardTitle className="text-3xl text-amber-100">Panatech Invoice</CardTitle>
          <p className="text-sm text-amber-100/70">
            SaaS-ready invoicing with account settings, secure persistence, and PDF exports.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {supabaseConfigured ? (
            userEmail ? (
              <p className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                Logged in as {userEmail}
              </p>
            ) : (
              <p className="rounded-md border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                Supabase is configured. Register or login to start managing invoices.
              </p>
            )
          ) : (
            <>
              <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                Authentication is temporarily unavailable. Please configure Supabase.
              </p>
              {process.env.NODE_ENV !== 'production' ? (
                <p className="rounded-md border border-amber-300/30 bg-neutral-900/70 px-3 py-2 text-xs text-amber-100/80">
                  Developer note: set `NEXT_PUBLIC_SUPABASE_URL` and
                  `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
                </p>
              ) : null}
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex rounded-md bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2 text-sm font-semibold text-black hover:brightness-105"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex rounded-md border border-amber-300/40 bg-neutral-900/70 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-neutral-800"
            >
              Register
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex rounded-md border border-orange-300/45 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100 hover:bg-orange-500/20"
            >
              Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
