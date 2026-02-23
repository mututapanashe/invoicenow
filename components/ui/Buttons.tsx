import { ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-gradient-to-r from-amber-300 via-orange-300 to-orange-400 text-neutral-950 shadow-lg shadow-orange-900/25 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60',
  outline:
    'border border-amber-300/45 bg-neutral-900/70 text-amber-100 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'bg-transparent text-amber-100 hover:bg-amber-400/10 hover:text-amber-50 disabled:cursor-not-allowed disabled:opacity-60',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
