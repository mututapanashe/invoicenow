import Link from 'next/link'
import { CheckCircle2, FileCheck2, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react'

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

  const primaryHref = userEmail ? '/dashboard' : '/register'
  const primaryLabel = userEmail ? 'Open dashboard' : 'Start free'

  const featureCards = [
    {
      icon: LayoutDashboard,
      title: 'Revenue intelligence',
      text: 'Track outstanding cash, collection velocity, and invoice performance from one command center.',
    },
    {
      icon: FileCheck2,
      title: 'Fast invoicing workflow',
      text: 'Create polished invoices in seconds and keep every record searchable, exportable, and organized.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure by default',
      text: 'Built with row-level security and authenticated access so every tenant only sees their own data.',
    },
  ]

  return (
    <div className="min-h-screen px-4 pb-14 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-2xl border border-slate-200/90 bg-white/85 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Panatech Invoice</p>
                <p className="text-xs text-slate-500">Modern finance operations</p>
              </div>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-slate-200/90">
            <CardHeader className="pb-4">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <CheckCircle2 size={14} /> Trusted by fast-moving teams
              </p>
              <CardTitle className="max-w-2xl text-3xl leading-tight sm:text-4xl">
                Invoice faster. Collect sooner. Scale smarter.
              </CardTitle>
              <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Panatech Invoice gives your business a clean billing workflow, real-time insights,
                and a premium client experience without operations overhead.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={primaryHref}
                  className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400"
                >
                  {primaryLabel}
                </Link>
                <Link
                  href="/login"
                  className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Continue with account
                </Link>
              </div>
              {userEmail ? (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Logged in as {userEmail}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-200/90">
            <CardHeader>
              <CardTitle className="text-xl">Live performance snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Avg. collection time</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">8.4 days</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Revenue recovery</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">+18%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Invoice accuracy</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">99.2%</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">Automated workflows</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">12 rules</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {featureCards.map((item) => (
            <Card key={item.title}>
              <CardHeader className="pb-3">
                <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <item.icon size={18} />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {!supabaseConfigured ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Sign-in is currently unavailable. Please try again shortly.
          </p>
        ) : null}
      </div>
    </div>
  )
}
