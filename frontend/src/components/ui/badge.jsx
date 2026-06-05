import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-300',
        secondary: 'border-violet-500/30 bg-violet-500/15 text-violet-300',
        outline: 'border-white/15 bg-white/5 text-slate-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
