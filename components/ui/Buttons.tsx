import { ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-300/60 hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = 'button', variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
