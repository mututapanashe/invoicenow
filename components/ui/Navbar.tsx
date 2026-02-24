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
        'flex min-h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md md:px-6',
        className
      )}
    >
      <div>
        <p className="text-lg font-semibold text-slate-900 md:text-xl">{title}</p>
        {subtitle ? <p className="text-xs text-slate-500 md:text-sm">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </header>
  )
}
