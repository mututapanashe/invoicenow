'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

type MobileNavLink = {
  href: string
  label: string
}

type MobileNavProps = {
  links: MobileNavLink[]
  className?: string
}

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export function MobileNav({ links, className }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('overflow-x-auto border-b border-amber-200/90 bg-amber-50/65 px-4 py-2', className)}>
      <div className="flex min-w-max items-center gap-2">
        {links.map((link) => {
          const active = isActivePath(pathname, link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-semibold transition',
                active
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-700 hover:bg-white/90 hover:text-amber-900'
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
