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
        'flex min-h-16 items-center justify-between border-b border-amber-200/90 bg-white/75 px-4 backdrop-blur-md md:px-6',
        className
      )}
    >
      <div>
        <p className="text-lg font-semibold text-amber-950 md:text-xl">{title}</p>
        {subtitle ? <p className="text-xs text-amber-800 md:text-sm">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </header>
  )
}
