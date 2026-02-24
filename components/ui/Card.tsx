import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-amber-200/90 bg-[linear-gradient(145deg,_rgba(255,255,255,0.96)_0%,_rgba(255,249,235,0.98)_55%,_rgba(255,252,244,0.98)_100%)] shadow-[0_18px_35px_-26px_rgba(161,98,7,0.65)] backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-gradient-to-b before:from-amber-100/60 before:to-transparent',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative z-10 flex flex-col gap-1.5 p-6 pb-2', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold text-amber-950', className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('relative z-10 p-6 pt-0', className)} {...props} />
}
