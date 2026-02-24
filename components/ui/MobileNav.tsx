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
    <nav className={cn('overflow-x-auto border-b border-slate-200 bg-white/85 px-4 py-2', className)}>
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
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-300/50'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
