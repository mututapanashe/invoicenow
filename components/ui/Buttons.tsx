import { ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-amber-950 shadow-sm shadow-amber-500/30 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-300 disabled:cursor-not-allowed disabled:opacity-60',
  outline:
    'border border-amber-300 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'bg-transparent text-amber-800 hover:bg-amber-100/70 hover:text-amber-950 disabled:cursor-not-allowed disabled:opacity-60',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
