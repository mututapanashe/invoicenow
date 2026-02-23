import Link from 'next/link'

import { cn } from '@/lib/utils'

type SidebarLink = {
  href: string
  label: string
  active?: boolean
}

type SidebarProps = {
  links: SidebarLink[]
  className?: string
}

export function Sidebar({ links, className }: SidebarProps) {
  return (
    <aside className={cn('w-full max-w-60 border-r border-gray-200 bg-white p-4', className)}>
      <div className="mb-6 px-2">
        <p className="text-lg font-bold text-gray-900">Panatech Invoice</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
              link.active
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
