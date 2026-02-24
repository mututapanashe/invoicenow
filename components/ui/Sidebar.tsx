'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type SidebarLink = {
  href: string
  label: string
}

type SidebarProps = {
  links: SidebarLink[]
  className?: string
}

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export function Sidebar({ links, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'w-full max-w-64 border-r border-amber-200/90 bg-amber-50/60 p-4',
        className
      )}
    >
      <div className="mb-6 rounded-xl border border-amber-200 bg-white/90 px-3 py-3">
        <p className="text-base font-semibold uppercase tracking-[0.18em] text-amber-900">Panatech</p>
        <p className="text-xs text-amber-700">Invoice Suite</p>
      </div>
      <nav className="space-y-1.5">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-semibold transition',
                active
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-700 hover:bg-white/90 hover:text-amber-900'
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
