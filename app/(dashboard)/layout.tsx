import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/Buttons'
import { MobileNav } from '@/components/ui/MobileNav'
import { Navbar } from '@/components/ui/Navbar'
import { Sidebar } from '@/components/ui/Sidebar'
import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'

type DashboardLayoutProps = {
  children: React.ReactNode
}

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/invoices', label: 'Invoices' },
  { href: '/create-invoice', label: 'Create Invoice' },
  { href: '/settings', label: 'Settings' },
]

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard is unavailable</h1>
        <p className="mt-3 text-slate-600">Authentication is currently unavailable.</p>
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400"
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  async function signOutAction() {
    'use server'

    const authClient = await createClient()
    await authClient.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex min-h-screen">
        <Sidebar links={dashboardLinks} className="hidden md:block" />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            title="Panatech Invoice"
            subtitle={user.email ?? undefined}
            rightSlot={
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
            }
          />
          <MobileNav links={dashboardLinks} className="md:hidden" />
          <main className="flex-1 p-4 sm:p-5 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
