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
        'w-full max-w-64 border-r border-amber-300/20 bg-gradient-to-b from-black/80 to-neutral-950/95 p-4',
        className
      )}
    >
      <div className="mb-6 rounded-lg border border-amber-300/30 bg-gradient-to-r from-amber-300/20 to-orange-300/20 px-3 py-3">
        <p className="text-base font-semibold uppercase tracking-[0.18em] text-amber-100">Panatech</p>
        <p className="text-xs text-amber-50/80">Invoice Suite</p>
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
                  ? 'bg-gradient-to-r from-amber-300 to-orange-300 text-black shadow-lg shadow-orange-900/25'
                  : 'text-amber-100/85 hover:bg-amber-300/10 hover:text-amber-50'
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
