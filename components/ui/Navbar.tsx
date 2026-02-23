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
        'flex min-h-16 items-center justify-between border-b border-amber-300/20 bg-black/35 px-6 backdrop-blur-md',
        className
      )}
    >
      <div>
        <p className="text-xl font-semibold text-amber-50">{title}</p>
        {subtitle ? <p className="text-sm text-amber-100/70">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </header>
  )
}
