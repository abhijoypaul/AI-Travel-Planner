import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }) {
  return <div className={cn('shimmer-dark rounded-xl', className)} {...props} />
}
