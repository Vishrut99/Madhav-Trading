import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const styles: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  pending: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-800 border-amber-300',
    dot: 'bg-amber-500',
  },
  ready: {
    label: 'Ready',
    cls: 'bg-forest-50 text-forest-700 border-forest-100',
    dot: 'bg-forest-600',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'bg-beige-200 text-brown-700 border-beige-300',
    dot: 'bg-brown-300',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = styles[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
        s.cls,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  );
}
