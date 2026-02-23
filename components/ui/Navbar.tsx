import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type NavbarProps = {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
  className?: string
}

export function Navbar({ title, subtitle, rightSlot, className }: NavbarProps) {
  return (
    <header
      className={cn(
        'flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-6',
        className
      )}
    >
      <div>
        <p className="text-xl font-semibold text-gray-900">{title}</p>
        {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </header>
  )
}
