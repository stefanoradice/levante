import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-background-secondary text-foreground-muted',
        variant === 'accent' && 'bg-accent-subtle text-accent',
        variant === 'muted' && 'bg-border/40 text-foreground-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
