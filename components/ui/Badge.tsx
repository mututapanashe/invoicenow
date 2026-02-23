import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-amber-200/15 text-amber-100 border border-amber-300/40',
  success: 'bg-emerald-300/15 text-emerald-100 border border-emerald-300/50',
  warning: 'bg-orange-300/15 text-orange-100 border border-orange-300/50',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}
