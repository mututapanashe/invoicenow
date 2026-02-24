import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'border border-amber-200 bg-amber-50 text-amber-800',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border border-rose-200 bg-rose-50 text-rose-700',
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
